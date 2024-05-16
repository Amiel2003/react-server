import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './BranchDetails.css'
import './ProductDetails.css'
import BounceLoader from 'react-spinners/BarLoader'
import { UilPen, UilPlus, UilTrash, UilCheck, UilX } from "@iconscout/react-unicons";

function ProductDetails({ id }) {
  const [show, setShow] = useState(false);
  const [productID, setProductID] = useState('')
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState(0)
  const [productDescription, setProductDescription] = useState('')
  const [loading, setLoading] = useState(true)

  const ProductURL = process.env.REACT_APP_PRODUCTS_URL + '/' + id;
  const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    console.log(ProductURL)
    axios.get(ProductURL)
      .then((res) => {
        const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.product, secretKey).toString(CryptoJS.enc.Utf8));
        console.log(decryptedData[0])
        setProductID(decryptedData[0]._id)
        setProductName(decryptedData[0].product_name)
        setProductPrice(decryptedData[0].price)
        setProductDescription(decryptedData[0].product_description)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error getting product by id: ', id)
      })
  };

  return (
    <div>
      <MuiButton
        variant="contained"
        color="primary"
        onClick={handleShow}
      >
        Details
      </MuiButton>


      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName='modal-employee'
      >
        <Modal.Header closeButton>
          <Modal.Title>DETAILS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading === true ? (
            <BounceLoader
            cssOverride={override}
            color="blue" />
          ):(
             <div className="product-details-container">
            <h3 className="product-title">{productName}</h3>
            <p className="product-description">{productDescription}</p>
            <h4 className="price">
              <span>₱{productPrice}</span>
            </h4>
            <h8 className="ID">
              <span className="ID">ID: {productID}</span>
            </h8>
            <div className="action">

            </div>
          </div>
          )}
         

        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ProductDetails;