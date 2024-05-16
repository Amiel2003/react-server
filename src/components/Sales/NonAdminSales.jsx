import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component'
import { NonAdminSalesColumn, CustomStyle } from "../../Data/Data";
import './Sales.css'
import { decryptCollection } from '../../functions/DecryptUser';
import CryptoJS from "crypto-js";
import { simplifySalesData, arrangeArray } from '../../functions/SimplifyData';
import axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import BarLoader from "react-spinners/BarLoader";
import AddSale from "./AddSale";
import { UilImport } from "@iconscout/react-unicons";
import { exportCSV } from "../../functions/FileValidation";
import {ToastContainer, toast, Zoom, Bounce} from 'react-toastify'

function NonAdminSales({ user }) {
    const [records, setRecords] = useState([])
    const [branchID, setBranchID] = useState('')
    const [salesRaw, setSales] = useState(null)
    const [loading, setLoading] = useState(false)
    const [inventory, setInventory] = useState([])
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
    const inventoryURL = process.env.REACT_APP_SALE_URL + `/${user.user._id}`

    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    function handleFilter(event) {
        const newData = salesRaw.filter(row => {
            return (
                row.in_charge.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row.selling_id.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row.branch_name.toLowerCase().includes(event.target.value.toLowerCase()))
        })
        setRecords(newData)
    }

    useEffect(() => {
        //retrieves all sales
        setLoading(true)
        getBranchID()
        axios.get(process.env.REACT_APP_SALE_URL)
            .then((res) => {
                const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.sales, secretKey).toString(CryptoJS.enc.Utf8));
                const sales = simplifySalesData(decryptedData)
                setRecords(sales)
                setSales(sales)
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error retrieving sales: ', error)
            })

        //retrieves branch inventory
        axios.get(inventoryURL)
            .then((res) => {
                const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.inventory, secretKey).toString(CryptoJS.enc.Utf8));
                setInventory(decryptedData)
            })
            .catch((error) => {
                console.error('Error getting inventory for sales: ', error)
            })
    }, [])

    async function getBranchID() {
        let BranchURL = ''
        if (user.user.role === 'supervisor') {
            BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + user.user._id + '/' + 'supervisor';
        } else {
            BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + user.user._id + '/' + 'employee';
        }
        await axios.get(BranchURL)
            .then(async (branch) => {
                const branchFound = decryptCollection(branch.data.branch)

                console.log(branchFound.collection._id)
                await setBranchID(branchFound.collection._id)
            })
            .catch((error) => {
                console.error('Error getting branch with supervisor._id: ', error)
            })
    }

    function exportToCSV() {
        if (records.length === 0) {
            toast.error('No records to export')
        } else {
            const csvData = records.filter(obj => obj.branch_id === branchID).map(sale => ({
                in_charge: sale.in_charge,
                total_quantity: sale.products_sold,
                total_amount: sale.total_amount,
                products: sale.products.map(product => product.product._id).join(', '),
                date: sale.date_of_sale,
                selling_id: sale.selling_id
            }))


            exportCSV(csvData, `${branchID} sales`)
        }
    }

    function setSort(value) {
        const currentDate = new Date()

        switch (value) {
            case 'All time':
                console.log('all time')
                setRecords(salesRaw)
                break;
            case 'This week':
                console.log(salesRaw)
                const thisWeek = new Date(currentDate)
                thisWeek.setDate(currentDate.getDate() - currentDate.getDay())

                const thisWeekData = salesRaw.filter((item) => {
                    const itemDate = new Date(item.date_of_sale);
                    // Compare if the item's last restock is within the current week
                    return itemDate >= thisWeek && itemDate <= currentDate;
                });
                console.log('sss', thisWeekData)
                setRecords(thisWeekData)
                break;
            case 'Last week':
                console.log('last week')
                const lastWeek = new Date()
                lastWeek.setDate(currentDate.getDate() - 7)
                const startOfThisWeek = new Date(currentDate);
                startOfThisWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the beginning of the current week (Sunday)
                startOfThisWeek.setHours(0, 0, 0, 0); // Set time to midnight

                const lastWeekData = salesRaw.filter((item) => {
                    const itemDate = new Date(item.date_of_sale);
                    // Compare if the item's sale date is strictly within the last week (excluding the current week)
                    return itemDate >= lastWeek && itemDate < currentDate && itemDate < startOfThisWeek;
                });
                setRecords(lastWeekData)
                break;
            case 'Last month':
                console.log('last month')
                const lastMonth = new Date(currentDate);
                lastMonth.setMonth(currentDate.getMonth() - 1); // Set to the start of the last month
                const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                const lastMonthData = salesRaw.filter((item) => {
                    const itemDate = new Date(item.date_of_sale);
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
                    <ToastContainer draggable={false} transition={Zoom} autoClose={7000} />
                    <h1>BRANCH SALES TABLE</h1>
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
                        <AddSale user={user} inventory={inventory} />
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
                        columns={NonAdminSalesColumn}
                        data={records.filter(obj => obj.branch_id === branchID)}
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

export default NonAdminSales