import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component'
import Modal from 'react-bootstrap/Modal';
import './Employees.css'
import { verifySidebar } from '../../functions/AuthUtils';
import { useNavigate } from 'react-router-dom';
import { ArchivedEmployeeColumns, CustomStyle } from '../../Data/Data';
import { simplifyData } from '../../functions/SimplifyData';
import axios from 'axios';
import MuiButton from '@mui/material/Button';
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify'
import {UilExclamationCircle} from "@iconscout/react-unicons";
import 'react-toastify/dist/ReactToastify.css'
import CryptoJS from 'crypto-js';

function ArchivedEmployees({ user, setUser }) {
    const [show, setShow] = useState(false);
    const [records, setRecords] = useState([])
    const navigate = useNavigate();
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;


    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        axios.get(process.env.REACT_APP_GET_ARCHIVE_EMPLOYEE_URL)
        .then((res) => {
            const decrypted = CryptoJS.AES.decrypt(res.data, secretKey).toString(CryptoJS.enc.Utf8);
            const archivedEmployees = JSON.parse(decrypted)
            if(archivedEmployees.length === 0){
                setRecords(archivedEmployees)
            }else{
                simplifyData(archivedEmployees)
                .then((simplifiedArray) => {
                    setRecords(simplifiedArray)
                })
                .catch((error) => {
                    console.error('Error processing archived employees: ',error)
                })
            }
        })
        .catch((error)=>{
            console.error('Error retrieving archived employees: ',error)
            toast.error('Error retrieving archived employees')
        })
    };

    return (
        <>
            {/* <input type="button" className="btn btn-success" value={"+ Add Employee"} onClick={handleShow} /> */}
            <MuiButton
                variant="contained"
                color="error"
                onClick={() => {
                    verifySidebar(user, setUser).then((result) => {
                        if (result === false) {
                            navigate('/403');
                        } 
                        else {
                            handleShow()
                        }
                    });
                }}
            >
                <div className='exclamation'>
                    <UilExclamationCircle size='18'/>
                    <div>
                    Archived
                    </div>
                </div>
            </MuiButton>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName='modal-view-inventory'
            >
                <Modal.Header closeButton>
                    <Modal.Title>ARCHIVED EMPLOYEES</Modal.Title>
                    <ToastContainer draggable={false} transition={Zoom} autoClose={7000} />
                </Modal.Header>
                <Modal.Body>
                    <DataTable
                        columns={ArchivedEmployeeColumns}
                        data={records}
                        fixedHeader
                        pagination
                        customStyles={CustomStyle}
                        paginationPerPage={8}
                        paginationRowsPerPageOptions={[]}
                    >
                    </DataTable>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default ArchivedEmployees;