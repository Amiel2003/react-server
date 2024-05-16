import React from 'react';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { decryptCollection } from '../../functions/DecryptUser';
import { arrangeArray } from '../../functions/SimplifyData';
import ReactToPrint from 'react-to-print';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './Inventory.css';
import { UilMinus, UilPlus, UilTrash, UilAnnoyed } from "@iconscout/react-unicons";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateID } from '../../functions/GenerateID';

function UseSupply({ user, branchID, inventory }) {
    const [show, setShow] = useState(false);
    const [supplies, setSupplies] = useState([])
    const [supplyID, setSupplyID] = useState('')
    const [supplyName, setSupplyName] = useState('')
    const [quantity, setQuantity] = useState(0)

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
                const newArray = arrangedArray.filter(item => item.category === 'Supplies');
                setSupplies(newArray);
            })
            .catch(err => console.log('Error retrieving product collection: ', err));
    };

    function handleSubmit(e) {
        e.preventDefault()
        const matchingProduct = inventory.find((supplyObj) => supplyObj._id === supplyID);

        if(quantity > matchingProduct.quantity){
            toast.error('Not enough stock')
        }else{
            const supplyURL = process.env.REACT_APP_PURCHASE_URL + "/supplies"
            const supply = {
                branch_id: branchID,
                supply: supplyID,
                quantity: quantity,
                old_stock: matchingProduct.quantity
              }
              const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(supply), secretKey).toString();
            axios.post(supplyURL,{supply: encryptedData})
            .then((res) => {
                if(res.data.status !== 200){
                  toast.error(res.data.message)
                }else{
                  toast.success(res.data.message)
                  setTimeout(() => {
                    window.location.reload();
                  }, process.env.REACT_APP_RELOAD_TIME);
                }
              })
              .catch((error) => {
                console.error('Error inserting purchase: ',error)
              })
        }
        
    }

    function handleIDChange(e){
        const isProductValid = supplies.some((supplyObj) => supplyObj._id === e);
      
        if(isProductValid){
          const matchingProduct = supplies.find((supplyObj) => supplyObj._id === e);
          setSupplyID(matchingProduct._id)
          setSupplyName(matchingProduct.product_name)
        }else{
          setSupplyName('')
        }
      }


    return (
        <div>
            <MuiButton
                variant="contained"
                color="primary"
                onClick={handleShow}
                className='add-stock'
            >
                - Supply
            </MuiButton>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName='modal-branch'
            >
                <Modal.Header closeButton>
                    <Modal.Title>SUBTRACT SUPPLY</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='main-sale-holder'>
                        <div>
                            <ToastContainer draggable={false} transition={Zoom} autoClose={7000} />
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div class="modal-body">
                                    <div class="form-group">
                                        <label for="item_id">Item ID</label>
                                        <input type="text" class="form-control" id="item_id" onChange={(e)=>handleIDChange(e.target.value)} placeholder="Supply ID" required />
                                    </div>
                                    <div class="form-group">
                                        <label HtmlFor="Item_name">Item Name</label>
                                        <input type="text" class="form-control" id="item_name" value={supplyName} placeholder="Supply Name" disabled required />
                                    </div>
                                    <div class="form-group">
                                        <label for="quantity">Quantity</label>
                                        <input type="number" class="form-control" id="stock_quantity" onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
                                    </div>
                                </div>
                                <div class="modal-footer border-top-0 d-flex justify-content-center btn-stock" style={{ width: '200px', marginLeft: '350px'}}>
                                    <button type="submit" class="btn btn-secondary">Close</button>
                                    <button type="submit" class="btn btn-primary">Subtract</button>
                                </div>
                            </form>
                        </div>

                    </div>

                </Modal.Body>
            </Modal>
        </div>
    );
}

export default UseSupply;
