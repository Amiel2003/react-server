import React from 'react';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { decryptCollection } from '../../functions/DecryptUser';
import { arrangeArray } from '../../functions/SimplifyData';
import ReactToPrint from 'react-to-print';
import PrintableReceipt from './PrintableReceipt';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './Sales.css';
import './AddSale.css';
import { UilMinus, UilPlus, UilTrash, UilAnnoyed } from "@iconscout/react-unicons";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateID } from '../../functions/GenerateID';

function AddSale({ user, inventory }) {
    const [show, setShow] = useState(false);
    const [id] = useState(generateID().toUpperCase());
    const [productName, setProductName] = useState('');
    const [product, setProduct] = useState(null);
    const [productID, setProductID] = useState('');
    const [productArray, setProductArray] = useState([]);
    const [products, setProducts] = useState([{}]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [receipt, setReceipt] = useState(false)
    const [componentRef, setComponentRef] = React.useState(null);

    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => {
        
        setShow(true);
        axios.get(process.env.REACT_APP_PRODUCTS_URL)
            .then(res => {
                const data = decryptCollection(res.data.products);
                const arrangedArray = arrangeArray(data.collection);
                const newArray = arrangedArray.filter(item => item.category !== 'Supplies');

                // Add quantity attribute to all objects in newArray
                const newArrayWithQuantity = newArray.map(item => ({
                    ...item,
                    quantity: 0 // You can set the initial quantity value as needed
                }));

                //adds all quantity
                const totalQuantity = newArrayWithQuantity.reduce((sum, item) => sum + item.quantity, 0);
                setTotalQuantity(totalQuantity);
                setProducts(newArrayWithQuantity);
            })
            .catch(err => console.log('Error retrieving product collection: ', err));
    };

    useEffect(() => {
        handleTotalAmountChange();
    }, [productArray]);

    function handleProduct(value) {
        const isProductValid = products.some((productObj) => productObj._id === value);
        if (isProductValid) {
            const matchingProduct = products.find((productObj) => productObj._id === value);
            setProductName(matchingProduct.product_name);
            setProduct(matchingProduct);
            setProductID(value);
            console.log(matchingProduct);
        } else {
            setProductName('');
            setProduct(null);
        }
    }

    function storeProductToArray() {
        //checks if item is out of stock or not
        if (inventory[0].products.some((productObj) => productObj.product === productID && productObj.stock === 0)) {
            toast.error('Out of stock!');
        } else {
            if (productArray.some((productObj) => productObj._id === productID)) {
                toast.error('Product already in list');
            } else {
                const updatedProductArray = [...productArray, product]; // Create a new array by spreading the existing array and adding the new product
                setProductArray(updatedProductArray);
                setProductName('');
                setProduct(null);
            }
        }
    }

    function subtractQuantity(index, e) {
        e.preventDefault();
        if (totalQuantity !== 0 && productArray[index].quantity !== 0) {
            const updatedProductArray = [...productArray];
            updatedProductArray[index] = {
                ...updatedProductArray[index],
                quantity: updatedProductArray[index].quantity - 1
            };
            setProductArray(updatedProductArray);
            setTotalQuantity(totalQuantity - 1);
        }
    }

    function addQuantity(index, id, e) {
        e.preventDefault();
        const inventoryStock = inventory[0].products.find(product => product.product === id)

        //checks if quantity exceeds the stock level
        if (productArray[index].quantity >= inventoryStock.stock) {
            toast.error('Not enough stock')
        } else {
            const updatedProductArray = [...productArray];
            //increments the quantity of the product
            updatedProductArray[index] = {
                ...updatedProductArray[index],
                quantity: updatedProductArray[index].quantity + 1
            };
            setProductArray(updatedProductArray);
            setTotalQuantity(totalQuantity + 1);
        }

    }

    function deleteProductEntry(index, e) {
        e.preventDefault();
        setTotalQuantity(totalQuantity - productArray[index].quantity);
        const updatedArray = productArray.filter((_, i) => i !== index);
        setProductArray(updatedArray);
        console.log(updatedArray);
    }

    const handleTotalAmountChange = () => {
        // Calculate total amount based on the updated productArray
        const newTotalAmount = productArray.reduce(
            (total, item) => total + item.quantity * item.price,
            0
        );

        setTotalAmount(newTotalAmount);
    };

    function receiptChecker(value) {
        setReceipt(value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (productArray.length === 0) {
            toast.error('No products listed')
        } else {
            // Filter products with quantity equal to zero
            const productsWithZeroQuantity = productArray.filter(product => product.quantity === 0);

            if (productsWithZeroQuantity.length > 0) {
                toast.error('Some products have quantity equal to zero');
            } else {
                const sale = {
                    selling_id: id,
                    in_charge: user.user._id,
                    products: productArray,
                    total_quantity: totalQuantity,
                    total_amount: totalAmount,
                }

                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(sale), secretKey).toString();
                axios.post(process.env.REACT_APP_SALE_URL, { data: encryptedData })
                    .then((res) => {
                        if (res.status !== 200) {
                            toast.error('Error inserting sale!')
                        } else {
                            toast.success('Sale recorded successfully!')
                            setTimeout(() => {
                                window.location.reload();
                            }, process.env.REACT_APP_RELOAD_TIME);
                        }
                    })
                    .catch((error) => {
                        console.error('Error sending sale info', error)
                    })
            }
        }
    }

    const [printableReceiptData, setPrintableReceiptData] = useState({
        id: '',
        totalQuantity: 0,
        totalAmount: 0,
        products: [],
    });

    // Function to update PrintableReceipt data
    const updatePrintableReceiptData = () => {
        setPrintableReceiptData({
            id,
            totalQuantity,
            totalAmount,
            products: [...productArray], // Copy the array to avoid mutation
        });
    };

    useEffect(() => {
        handleTotalAmountChange();
        updatePrintableReceiptData(); // Update PrintableReceipt data on changes
    }, [productArray, totalQuantity, totalAmount]);


    return (
        <div>
            <MuiButton
                variant="contained"
                color="success"
                onClick={handleShow}
                className='add-stock'
            >
                + Sale
            </MuiButton>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName='sale-view-inventory'
            >
                <Modal.Header closeButton>
                    <Modal.Title>ISSUE SALE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='main-sale-holder'>
                        <div>
                            <ToastContainer draggable={false} transition={Zoom} autoClose={7000} />
                            <div className='sale-product'>
                                <div className='sale-product-id'>
                                    <label htmlFor="product-id">Product ID</label>
                                    <input type="text" name="product-id" className='form-control sale-product-id' placeholder='Product ID' onChange={(e) => handleProduct(e.target.value)} />
                                </div>
                                <div className='sale-product-name'>
                                    <label htmlFor="product-name">Product Name</label>
                                    <input type="text" name="product-name" className='form-control' value={productName} placeholder='Product Name' disabled />
                                </div>
                                <UilPlus className='icons add-product-sale' onClick={storeProductToArray} />
                            </div>
                            <section className="h-100 h-custom">
                                <div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h6>Items Ordered:</h6>
                                        </div>
                                        <form className="mt-4" onSubmit={(e) => handleSubmit(e)}>
                                            {productArray.length > 0 ? (
                                                <div>
                                                    {productArray.map((product, index) => (
                                                        <div className="form-outline form-white mb-4" key={index}>
                                                            <hr></hr>

                                                            <div className='data-row-sale'>
                                                                <div>
                                                                    <UilTrash size='24' color='red' className='icons' onClick={(e) => deleteProductEntry(index, e)} />
                                                                    <label className="form-label sale-input" htmlFor={`typeName-${index}`}>
                                                                        <div className='total-amount-product'>
                                                                            Total: ₱{product.quantity * product.price}
                                                                        </div>
                                                                        <div className='product-name'>
                                                                            {product.product_name} {/* Use the product's name here */}
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                                <div>
                                                                    <UilMinus className="minus icons" size='18' onClick={(e) => subtractQuantity(index, e)} />
                                                                    <label className="form-label sale-input" htmlFor={`typeName-${index}`}>
                                                                        <input type="text" value={productArray[index].quantity} className="input form-control" placeholder='No.' disabled></input>
                                                                    </label>
                                                                    <UilPlus size='18' className='icons' onClick={(e) => addQuantity(index, product._id, e)} />
                                                                </div>
                                                            </div>

                                                            <hr className="my-4" /> {/* Moved the hr tag inside the map() function */}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div>
                                                    <center><UilAnnoyed size='100' /></center>
                                                    <center>No products added</center>
                                                </div>
                                            )}
                                            <div className="" style={{ bottom: '20px', width: '400px', position: 'absolute' }}>
                                                <MuiButton
                                                    onClick={handleClose}
                                                    variant="contained"
                                                    color="secondary"
                                                    className='btn-edit'
                                                >Cancel
                                                </MuiButton>

                                                <MuiButton
                                                    type='submit'
                                                    style={{ marginLeft: '5px' }}
                                                    variant="contained"
                                                    color="success"
                                                    className='btn-edit save-sale'
                                                >Save
                                                </MuiButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className='invoice'>
                            <PrintableReceipt ref={(ref) => setComponentRef(ref)} user={user} {...printableReceiptData} view={'add-sale'} date={Date.now()} />
                            <div className="sale-buttons">

                                <div className="buttons-for-sale" style={{ marginTop: '5px', width: '400px' }}>
                                    <ReactToPrint
                                        trigger={() => <MuiButton
                                            variant="contained"
                                            color="primary"
                                            style={{ marginLeft: '5px' }}
                                            className='btn-edit'>Generate Receipt</MuiButton>}
                                        content={() => componentRef} // Reference to the PrintableReceipt component
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                </Modal.Body>
            </Modal>
        </div>
    );
}

export default AddSale;
