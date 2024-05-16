import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useState } from 'react';
import { verifySidebar } from '../../functions/AuthUtils';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import BarLoader from "react-spinners/BarLoader";

function AddProduct({ user, setUser }) {
    const [show, setShow] = useState(false);
    const [productID, setProductID] = useState('');
    const [productName, setProductName] = useState('')
    const [sellingPrice, setSellingPrice] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [category, setCategory] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY

    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "black",
        width: '200px'
    };

    const navigate = useNavigate()
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setErrorMessage(null)
        setSuccessMessage(null)
        setShow(true);
    };

    function submit(e) {
        e.preventDefault()
        setLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)
        if(productID <= 0 || sellingPrice <= 0){
            setErrorMessage("cannot accept zero and negative values");
            setLoading(false)
        }else{
            const productInfo = {
                _id: productID,
                product_name: productName,
                price: sellingPrice,
                category: category,
                product_description: productDescription
            }

            let hasWhitespace = false;

            for (const value of Object.values(productInfo)) {
                if (typeof value === 'string' && /\s/.test(value)) {
                    // If value is a string and contains whitespace
                    hasWhitespace = true;
                    break; // Exit loop early since we've found a value with whitespace
                }
            }

            if (hasWhitespace) {
                setErrorMessage("Cannot accept empty strings");
            } else {
                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(productInfo), secretKey).toString();
                axios.post(process.env.REACT_APP_PRODUCTS_URL, { data: encryptedData })
                    .then(res => {
                        if (res.data.status !== 200) {
                            setLoading(false)
                            setSuccessMessage(null)
                            setErrorMessage(res.data.message)
                        } else {
                            setLoading(false)
                            setErrorMessage(null)
                            setSuccessMessage(res.data.message)
        
                            setTimeout(() => {
                                window.location.reload();
                            }, process.env.REACT_APP_RELOAD_TIME);
                        }
                    })
                    .catch(err => console.log('Error sending data to server ', err))
                   }
           
        }
        
    }

    return (
        <>
            <MuiButton
                variant="contained" // Use the "contained" variant for a filled button
                color="success" // Use "success" color, or choose another color from the theme
                onClick={() => {
                    verifySidebar(user, setUser).then((result) => {
                        if (result === false) {
                            navigate('/403');
                        } else {
                            setShow(true);
                        }
                    });
                }}
            >
                + Add Product
            </MuiButton>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName='modal-product'
            >
                <Modal.Header closeButton>
                    <Modal.Title>PRODUCT FORM</Modal.Title>
                    {loading && (
                        <BarLoader
                            cssOverride={override}
                            color="blue" />
                    )}
                    {errorMessage && (
                        <div class="alert alert-danger" role="alert" id="error-div">
                            <center><b><p id="error-message">{errorMessage}</p></b></center>
                        </div>
                    )}
                    {successMessage && (
                        <div class="alert alert-success" role="alert" id="error-div">
                            <center><b><p id="error-message">{successMessage}</p></b></center>
                        </div>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <form className='productForm' onSubmit={(e) => submit(e)}>
                        <div className="div1">
                            <div className="productIDdiv">
                                <label htmlFor="productID">Product ID</label>
                                <input type="text" name="productID" className='form-control productID' placeholder='Product ID' onChange={(e) => setProductID(e.target.value)} required />
                            </div>
                            <div className="productNameDiv">
                                <label htmlFor="productName">Product Name</label>
                                <input type="text" name="productName" className='form-control productName' placeholder='Product Name' onChange={(e) => setProductName(e.target.value)} required />
                            </div>
                            <div className="sellingPriceDiv">
                                <label htmlFor="sellingPrice">Selling Price</label>
                                <input type="number" name="sellingPrice" className='form-control sellingPrice' placeholder='Selling Price' onChange={(e) => setSellingPrice(e.target.value)} required />
                            </div>
                            <div className="productCategory">
                                <label htmlFor="category">Category</label>
                                <select name="category" className='form-control' required onChange={(e) => setCategory(e.target.value)}>
                                    <option value="" disabled selected>--select--</option>
                                    <option value="Supplies">Supplies</option>
                                    <option value="Product">Product</option>
                                </select>
                            </div>
                        </div>
                        <div className="div2">
                            <div className="productDescriptionDiv">
                                <label htmlFor="productDescription">Product Description</label>
                                <textarea class="form-control productDescription" name='productDescription' rows="6" placeholder="Product Description" onChange={(e) => setProductDescription(e.target.value)} required></textarea>
                            </div>
                        </div>
                        <div className="buttonsProduct">
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" type='submit'>Save Product</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default AddProduct;