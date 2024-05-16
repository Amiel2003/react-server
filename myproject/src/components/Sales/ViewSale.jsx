import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { simplifyInventoryData } from '../../functions/SimplifyData';
import { NonAdminSalesColumn, CustomStyle } from "../../Data/Data";
import ReactToPrint from 'react-to-print';
import './Sales.css'
import BounceLoader from 'react-spinners/BarLoader'
import TextField from '@mui/material/TextField';
import PrintableReceipt from './PrintableReceipt';
import { decryptLocalStorageUser } from '../../functions/DecryptUser';

function ViewSale({ object }) {
    const [show, setShow] = useState(false);
    const [products, setProducts] = useState([])
    const [records, setRecords] = useState([])
    const [saleCollection, setSaleCollection] = useState(null)
    const [sale, setSale] = useState(null)
    const [componentRef, setComponentRef] = React.useState(null);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const decryptedUser = storedUser ? decryptLocalStorageUser(storedUser) : null;
    const user = {
        user: {
            first_name: object.in_charge,
            last_name: '',
            _id: object._id,
            role: object.role,
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        prepareProducts(object.products)
    };

    function prepareProducts(products) {
        const simplifiedProducts = []
        products.forEach(product => {
            const obj = {
                product_name: product.product.product_name,
                quantity: product.quantity,
            }
            simplifiedProducts.push(obj)
        });

        setProducts(simplifiedProducts)
    }

    return (
        <div>
            <MuiButton
                variant="contained"
                color="primary"
                onClick={handleShow}
            >
                DETAILS
            </MuiButton>


            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName='modal-product'
            >
                <Modal.Header closeButton>
                    <Modal.Title>SALE DETAILS</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <PrintableReceipt ref={(ref) => setComponentRef(ref)}
                        user={user}
                        products={products}
                        id={object.selling_id}
                        totalQuantity={object.products_sold}
                        totalAmount={object.total_amount}
                        date={object.date_of_sale}
                        view={'view-sale'} />

                    <div className="text-end">
                        <MuiButton
                            onClick={handleClose}
                            variant="contained"
                            color="secondary"
                            className='btn-edit'
                        >Cancel
                        </MuiButton>
                        <ReactToPrint
                            trigger={() => <MuiButton
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: '5px' }}
                                className='btn-edit'>Generate Receipt</MuiButton>}
                            content={() => componentRef} // Reference to the PrintableReceipt component
                        />
                    </div>


                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ViewSale;