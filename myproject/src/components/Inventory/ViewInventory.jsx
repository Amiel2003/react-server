import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { simplifyInventoryData } from '../../functions/SimplifyData';
import { SupervisorInventoryColumns, CustomStyle } from "../../Data/Data";
import SupervisorInventory from './SupervisorInventory';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './Inventory.css'
import BounceLoader from 'react-spinners/BarLoader'
import TextField from '@mui/material/TextField';
import DataTable from 'react-data-table-component'

function ViewInventory({ id, name }) {
    const [show, setShow] = useState(false);
    const [records, setRecords] = useState([])
    const [inventoryCollection, setInventoryCollection] = useState(null)
    const [supervisor, setSupervisor] = useState('')
    const [inventory, setInventory] = useState(null)
    const [loading, setLoading] = useState(true)

    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        const InventoryURL = process.env.REACT_APP_INVENTORY_URL + '/' + id
        axios.get(InventoryURL)
            .then((inventory) => {
                const decryptedData = JSON.parse(CryptoJS.AES.decrypt(inventory.data.inventory, secretKey).toString(CryptoJS.enc.Utf8));
                setInventoryCollection(decryptedData)
                const simplifyInventory = simplifyInventoryData(decryptedData[0].products)
                setRecords(simplifyInventory)
                setInventory(simplifyInventory)

                //endpoint for retrieval of the branch supervisor
                const EmployeeURL = process.env.REACT_APP_EMPLOYEES_URL + '/' + decryptedData[0].branch_id.supervisor; 
                axios.get(EmployeeURL)
                    .then((res) => {
                        const decryptedDataSupervisor = JSON.parse(CryptoJS.AES.decrypt(res.data.employee, secretKey).toString(CryptoJS.enc.Utf8));
                        const user = {
                            user: decryptedDataSupervisor[0]
                        }
                        setSupervisor(user)
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.error(`Error retrieving employee ${id}`, error)
                    })

            })
            .catch((error) => {
                console.error('Error retrieving inventory: ', error)
            })
    };

    return (
        <div>
            <MuiButton
                variant="contained"
                color="primary"
                onClick={handleShow}
            >
                VIEW
            </MuiButton>


            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName='modal-view-inventory'
            >
                <Modal.Header closeButton>
                    <Modal.Title>INVENTORY DETAILS</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {loading === true ? null :(
                        <SupervisorInventory user={supervisor}/>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ViewInventory;