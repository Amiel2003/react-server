import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { decryptCollection } from '../../functions/DecryptUser';
import { arrangeArray } from '../../functions/SimplifyData';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './Inventory.css'
import {ToastContainer, toast, Zoom, Bounce} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function AddStock({ id, branchID, inventory }) {
  const [show, setShow] = useState(false);
  const [productID, setProductID] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [products, setProducts] = useState([])
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY

  const handleClose = () => {
    setShow(false)
    setProductName('')
    setProductID('')
    setProductPrice(0)
    setQuantity(0)
  };
  const handleShow = () => {
    setShow(true);
    axios.get(process.env.REACT_APP_PRODUCTS_URL)
    .then(res => {
        const data = decryptCollection(res.data.products)
        setProducts(data.collection)
    })
    .catch(err => console.log('Error retrieving product collection: ', err))
  };

function handleIDChange(e){
  const isProductValid = products.some((productObj) => productObj._id === e);

  if(isProductValid){
    const matchingProduct = products.find((productObj) => productObj._id === e);
    setProductID(matchingProduct._id)
    setProductName(matchingProduct.product_name)
    setProductPrice(matchingProduct.price)
    setErrorMessage(null)
  }else{
    setProductName('')
    setProductPrice(0)
    setErrorMessage(
      e.trim() === ''
      ? '' 
      : `Product not found`
    )
  }
}

function submit(e) {
  e.preventDefault()
  const matchingProduct = inventory.find((productObj) => productObj._id === productID);

  if(quantity <= 0){
    setErrorMessage("Quantity must be greater than zero");
  }else{
    const purchase = {
      branch_id: branchID,
      total_amount: quantity * productPrice,
      product: productID,
      quantity: quantity,
      old_stock: matchingProduct.quantity
    }
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(purchase), secretKey).toString();
  
    axios.post(process.env.REACT_APP_PURCHASE_URL,{data: encryptedData})
    .then((res) => {
      if(res.data.status !== 200){
        toast.error(res.data.message)
      }else{
        toast.success("Stock added successfully")
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

  return (
    <div>
      <MuiButton
        variant="contained"
        color="success"
        onClick={handleShow}
        className='add-stock'
      >
        + Add Stock
      </MuiButton>


      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName='modal-branch'
      >
        <Modal.Header closeButton>
          <Modal.Title>ADD STOCK</Modal.Title>
          {errorMessage && (
                  <div class="alert alert-danger" role="alert" id="error-div">
                     <center><b><p id="error-message">{errorMessage}</p></b></center>
                 </div>
          )}
        </Modal.Header>
        <Modal.Body>

          <div>
          <ToastContainer draggable={false} transition={Zoom} autoClose={7000}/>
            <form onSubmit={(e) => submit(e)}>
              <div class="modal-body">
                <div class="form-group">
                  <label for="item_id">Item ID</label>
                  <input type="text" class="form-control" onChange={(e)=>handleIDChange(e.target.value)} id="item_id" placeholder="Item ID" required/>
                </div>
                <div class="form-group">
                  <label HtmlFor="Item_name">Item Name</label>
                  <input type="text" class="form-control" id="item_name" value={productName} placeholder="Item Name" disabled required/>
                </div>
                <div class="form-group">
                  <label for="unitprice">Unit Price</label>
                  <input type="number" class="form-control" value={productPrice} id="unit_price" placeholder="Unit Price" disabled />
                </div>
                <div class="form-group">
                  <label for="quantity">Quantity</label>
                  <input type="number" class="form-control" onChange={(e) => setQuantity(e.target.value)} id="stock_quantity" placeholder="Quantity" required/>
                </div>
                <div class="form-group">
                  <label for="stock_total">Total Amount</label>
                  <input type="number" class="form-control" id="total_amount" value={(quantity * productPrice)} placeholder="Total Amount" disabled />
                </div>
              </div>
              <div class="modal-footer border-top-0 d-flex justify-content-center btn-stock">
                <button type="submit" class="btn btn-secondary">Close</button>
                <button type="submit" class="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddStock;