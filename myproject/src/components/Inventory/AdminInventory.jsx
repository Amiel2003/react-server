import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component'
import { AdminInventoryColumns, CustomStyle } from "../../Data/Data";
import axios from "axios";
import CryptoJS from "crypto-js";
import { simplifyInventoryDataAdmin, arrangeArray } from '../../functions/SimplifyData';
import { exportCSV } from '../../functions/FileValidation';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import BarLoader from "react-spinners/BarLoader";
import { UilImport } from "@iconscout/react-unicons";


function AdminInventory({ user }) {
    const [records, setRecords] = useState([])
    const [inventories, setInventories] = useState(null)
    const [loading, setLoading] = useState(true)
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

    function handleFilter(event) {
        const newData = inventories.filter(row => {
            return (
                row.branch_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row.supervisor.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row.address.toLowerCase().includes(event.target.value.toLowerCase())) 
        })
        setRecords(newData)
    }

    useEffect(() => {
        axios.get('http://localhost:5000/inventory')
            .then((res) => {
                const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.inventories, secretKey).toString(CryptoJS.enc.Utf8));
                const simplifiedData = simplifyInventoryDataAdmin(decryptedData)
                const filteredArray = simplifiedData.filter(item => !item.archived);
                setRecords(filteredArray)
                setLoading(false)
                setInventories(simplifiedData)
            })
            .catch((error) => {
                console.error('Error getting all inventories: ', error)
            })
    }, [])

    function exportToCSV() {

        console.log(inventories)

        const csvData = inventories.map(inventory => ({
            ID: inventory._id,
            supervisor: inventory.supervisor,
            branch_name: inventory.branch_name,
            total_value: inventory.total_value
        }))

        exportCSV(csvData, 'inventories')
    }

    return (
        <div>
            {loading ? (
                <BarLoader
                cssOverride={override}
                color="red" />
            ) : (
                <div>
                    <h1>INVENTORY TABLE</h1>
                    <div className="text-end">
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            onChange={handleFilter}
                            className="filter"
                        />
                        <Button variant="contained" color="secondary" className="MuiButton-contained csv" onClick={exportToCSV}>
                            <div className="import">
                                <UilImport size='18' />
                                <div>
                                    Export as CSV
                                </div>
                            </div>
                        </Button>

                    </div>


                    <DataTable
                        columns={AdminInventoryColumns}
                        data={records}
                        fixedHeader
                        pagination
                        customStyles={CustomStyle}
                        paginationPerPage={8}
                        paginationRowsPerPageOptions={[]}
                    >
                    </DataTable>
                </div>
            )}
        </div>

    )
}

export default AdminInventory