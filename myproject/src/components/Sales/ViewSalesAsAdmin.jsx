import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { simplifyInventoryData } from '../../functions/SimplifyData';
import { SupervisorInventoryColumns, CustomStyle } from "../../Data/Data";
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './Sales.css'
import BounceLoader from 'react-spinners/BarLoader'
import TextField from '@mui/material/TextField';
import DataTable from 'react-data-table-component'

function ViewSalesAsAdmin({ id }) {
    const [show, setShow] = useState(false);
    const [records, setRecords] = useState([])

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

    function handleFilter(event) {
       
    }

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
                    <Modal.Title>BRANCH SALES</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <div className="text-end">
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            onChange={handleFilter}
                            className="filter"
                        />
                        <MuiButton variant="contained" color="secondary" className="MuiButton-contained csv">Export as CSV</MuiButton>
                    </div>

                    <DataTable
                        columns={SupervisorInventoryColumns}
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
        </div>
    )
}

export default ViewSalesAsAdmin;