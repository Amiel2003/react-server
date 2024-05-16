import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component'
import { AdminSalesColumn, CustomStyle, AdminSaleData } from "../../Data/Data";
import './Sales.css'
import { decryptCollection } from '../../functions/DecryptUser';
import CryptoJS from "crypto-js";
import { simplifySalesData, simplifyBranchData, arrangeArray, simplifyAdminSales, simplifyInventoryDataAdmin } from '../../functions/SimplifyData';
import axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Select, MenuItem } from "@mui/material";
import BarLoader from "react-spinners/BarLoader";
import { exportCSV } from "../../functions/FileValidation";
import { UilImport } from "@iconscout/react-unicons";

function AdminSales({ user, setViewInventory, setSupervisor }) {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(false)
    const [sales, setSales] = useState([])
    const [branches, setBranches] = useState([])
    const [inventory, setInventory] = useState([])
    const [filter, setFilter] = useState([])
    const [selectedOption, setSelectedOption] = useState('');
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
    const inventoryURL = process.env.REACT_APP_SALE_URL + `/${user.user._id}`

    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    function handleFilter(event) {
        const newData = filter.filter(row => {
            return (
                row.branch_name.toLowerCase().includes(event.target.value.toLowerCase())) 
        })
        setRecords(newData)
    }

    function exportToCSV() {
        console.log(records)
        const csvData = records.map(sale => ({
            ID: sale.branch_id,
            branch_name: sale.branch_name,
            supervisor: sale.user.user.first_name + " " + sale.user.user.last_name,
            products_sold: sale.products_sold,
            total_sales: sale.total_sales
        }))

        exportCSV(csvData, 'sales')
    }

    useEffect(() => {
        setLoading(true)
        axios.get('http://localhost:5000/inventory/sale/get')
            .then((res) => {
                const decryptedInventories = JSON.parse(CryptoJS.AES.decrypt(res.data.inventories, secretKey).toString(CryptoJS.enc.Utf8));
                setInventory(decryptedInventories)
                const filteredInventories = decryptedInventories.filter(item => !item.archived);
                axios.get(process.env.REACT_APP_BRANCHES_URL)
                    .then((res) => {
                        const branchData = decryptCollection(res.data.branches)
                        const simplifiedData = simplifyBranchData(branchData)
                        const filteredArray = simplifiedData.filter(item => !item.archived);
                        const arrangedArray = arrangeArray(filteredArray)
                        setBranches(arrangedArray)
                        axios.get(process.env.REACT_APP_SALE_URL)
                            .then(async (res) => {
                                const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.sales, secretKey).toString(CryptoJS.enc.Utf8));
                                const allSales = simplifySalesData(decryptedData)
                                setSales(allSales)
                                const simplifiedArray = await simplifyAdminSales(arrangedArray, allSales, branchData.collection, filteredInventories)
                                setFilter(simplifiedArray)
                                setRecords(simplifiedArray)
                                setLoading(false)
                            })
                            .catch((error) => {
                                console.error('Error retrieving sales: ', error)
                            })
                    })
                    .catch((error) => {
                        console.error('Error retrieving branches collection ', error)
                    })
            })
            .catch((error) => {
                console.error('Error getting all inventories: ', error)
            })
    }, [])

    function handleViewInventory(data){
        setSupervisor(data.user)
        setViewInventory(true)
    }

    return (
        <div className="container mt-5">
            {loading === true ? (
                <BarLoader
                    cssOverride={override}
                    color="green" />
            ) : (
                <div>
                    <h1>SALES TABLE</h1>
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
                        columns={[
                            ...AdminSalesColumn,
                            {
                                cell: (row) => (
                                    <Button
                                        onClick={() => handleViewInventory(row)} // Pass the row data to setViewInventory
                                        variant="contained"
                                        color="primary"
                                    >
                                        View
                                    </Button>
                                ),
                                button: true,
                            },
                        ]}
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

export default AdminSales