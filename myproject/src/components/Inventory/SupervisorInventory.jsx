import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component'
import { SupervisorInventoryColumns, CustomStyle } from "../../Data/Data";
import './Inventory.css'
import { decryptCollection } from '../../functions/DecryptUser';
import CryptoJS from "crypto-js";
import { simplifyInventoryData, arrangeArray } from '../../functions/SimplifyData';
import axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddStock from "./AddStocks";
import BarLoader from "react-spinners/BarLoader";
import { UilImport } from "@iconscout/react-unicons";
import { exportCSV } from "../../functions/FileValidation";
import {ToastContainer, toast, Zoom, Bounce} from 'react-toastify'
import UseSupply from "./UseSupplies";

function SupervisorInventory({ user }) {
    const [records, setRecords] = useState([])
    const [inventoryCollection, setInventoryCollection] = useState(null)
    const [branchName, setBranchName] = useState('')
    const [branchID, setBranchID] = useState('')
    const [inventory, setInventory] = useState(null)
    const [loading, setLoading] = useState(true)
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    function handleFilter(event) {
        const newData = inventory.filter(row => {
            return (
                row.product.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row._id.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row.status.toLowerCase().includes(event.target.value.toLowerCase()))
        })
        setRecords(newData)
    }

    useEffect(() => {
        const BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + user.user._id + '/' + 'supervisor';
        axios.get(BranchURL)
            .then((branch) => {
                const branchFound = decryptCollection(branch.data.branch)
                setBranchName(branchFound.collection.branch_name)
                setBranchID(branchFound.collection._id)
                const InventoryURL = process.env.REACT_APP_INVENTORY_URL + '/' + branchFound.collection._id
                axios.get(InventoryURL)
                    .then((inventory) => {
                        const decryptedData = JSON.parse(CryptoJS.AES.decrypt(inventory.data.inventory, secretKey).toString(CryptoJS.enc.Utf8));
                        setInventoryCollection(decryptedData)
                        const simplifyInventory = simplifyInventoryData(decryptedData[0].products)
                        setRecords(simplifyInventory)
                        setInventory(simplifyInventory)
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.error('Error retrieving inventory: ', error)
                    })
            })
            .catch((error) => {
                console.error('Error getting branch with supervisor._id: ', error)
            })
    }, [])

    function exportToCSV() {
        if(records.length === 0){
            toast.error('No records to export')
        }else{
            console.log(records)
            const branchName = inventoryCollection[0].branch_id.branch_name
            const csvData = records.map(product => ({
                _id: product._id,
                name: product.product,
                category: product.category,
                price: product.price,
                stock: product.quantity,
                status: product.status,
                last_restock: product.last_restock
            }))
    
    
            exportCSV(csvData, `${branchName} inventory`)
        }
       
    }

    function setSort(value) {
        const currentDate = new Date()

        switch (value) {
            case 'All time':
                setRecords(inventory)
                break;
            case 'This week':
                const thisWeek = new Date(currentDate)
                thisWeek.setDate(currentDate.getDate() - currentDate.getDay())

                const thisWeekData = inventory.filter((item) => {
                    const itemDate = new Date(item.last_restock);
                    // Compare if the item's last restock is within the current week
                    return itemDate >= thisWeek && itemDate <= currentDate;
                });
                setRecords(thisWeekData)
                break;
            case 'Last week':
                const lastWeek = new Date()
                lastWeek.setDate(currentDate.getDate() - 7)
                const startOfThisWeek = new Date(currentDate);
                startOfThisWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the beginning of the current week (Sunday)
                startOfThisWeek.setHours(0, 0, 0, 0);

                const lastWeekData = inventory.filter((item) => {
                    const itemDate = new Date(item.last_restock);
                    // Compare if the item's last restock is strictly within the last week (excluding the current week)
                    return itemDate >= lastWeek && itemDate < currentDate && itemDate < startOfThisWeek;
                });
                setRecords(lastWeekData)
                break;
            case 'Last month':
                const lastMonth = new Date(currentDate);
                lastMonth.setMonth(currentDate.getMonth() - 1); // Set to the start of the last month
                const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
 
                const lastMonthData = inventory.filter((item) => {
                    const itemDate = new Date(item.last_restock);
                    // Compare if the item's last restock is within the last month
                    return itemDate >= lastMonth && itemDate < startOfCurrentMonth;
                });
                setRecords(lastMonthData)
                break;
            default:
                break;
        }
    }

    return (
        <div className="container mt-5">
            {loading === true ? (
                <BarLoader
                    cssOverride={override}
                    color="green" />
            ) : (
                <div>
                    <ToastContainer draggable={false} transition={Zoom} autoClose={7000}/>

                    <h1>{branchName.toUpperCase()} INVENTORY TABLE</h1>
                    <div className="text-end">
                        <select className="form-control date-sorter" onChange={(e) => setSort(e.target.value)}>
                            <option value="All time">All time</option>
                            <option value="This week">This week</option>
                            <option value="Last week">Last week</option>
                            <option value="Last month">Last month</option>
                        </select>
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            onChange={handleFilter}
                            className="filter"
                        />
                        <AddStock user={user} branchID={branchID} inventory={records} />
                        <UseSupply user={user} branchID={branchID} inventory={records} />

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
                        columns={SupervisorInventoryColumns}
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

export default SupervisorInventory