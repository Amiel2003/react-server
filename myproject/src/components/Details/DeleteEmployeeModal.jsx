import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './BranchDetails.css'
import BounceLoader from 'react-spinners/BarLoader'
import { UilTrash } from "@iconscout/react-unicons";

function DeleteEmployeeModal({ id, branchID, setEmployees, setErrorMessage }) {
  const [show, setShow] = useState(false);
  const [productID, setProductID] = useState('')
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState(0)
  const [productDescription, setProductDescription] = useState('')

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

  };

  function handleDelete(){
    axios.post(process.env.REACT_APP_DELETE_EMPLOYEE_IN_BRANCH,{_id: id, branch: branchID})
    .then((res)=>{
        if(res.data.status === 200){
          setEmployees(res.data.employees)
          setErrorMessage(null)
        }
    })
    .catch((error) => {
      console.error('Error deleting employee in branch:',error)
    })
  }

  return (
    <div>
      <UilTrash size='24' color='red' onClick={handleShow} />


      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName='modal-deletion'
      >
        <Modal.Header closeButton>
          <Modal.Title>CONFIRM DELETION</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <center> <p>Are you sure you want to delete this?</p></center>
          <center>
            <div className='cofirm-delete'>
              <div>
                <MuiButton
                  variant="contained"
                  color="success"
                  className='btn-edit'
                  onClick={handleDelete}
                >YES
                </MuiButton>
              </div>

              <div>
                <MuiButton
                  variant="contained"
                  color="error"
                  className='btn-edit'
                  onClick={handleClose}
                >NO
                </MuiButton>
              </div>

            </div>

          </center>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DeleteEmployeeModal;