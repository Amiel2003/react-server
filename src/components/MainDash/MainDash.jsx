import React, { useState, useEffect } from "react";
import './MainDash.css'
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import Chart from "../Chart/Chart";
import BranchTable from "../Branches/Branches";
import EmployeeTable from "../Employees/Employees";
import About from "../About/About";
import ProductsTable from "../Products/Products";
import InventoryTable from "../Inventory/Inventory";
import SalesTable from "../Sales/Sales"
import CryptoJS from "crypto-js";
import axios from "axios";
import BarLoader from "react-spinners/BarLoader";
import { decryptCollection } from "../../functions/DecryptUser";

const MainDash = ({ data, user, setUser, selectedMenuItem }) => {
    const capitalizedRole = user.role.toUpperCase();
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
    const [sales, setSales] = useState('')
    const [expenses, setExpenses] = useState('')
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(true)
    const [branch, setBranch] = useState('')
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    useEffect(() => {
        axios.get(process.env.REACT_APP_SALE_URL)
            .then((res) => {
                const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.sales, secretKey).toString(CryptoJS.enc.Utf8));
                setSales(decryptedData)
                axios.get('http://localhost:5000/inventory')
                    .then((res) => {
                        const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.inventories, secretKey).toString(CryptoJS.enc.Utf8));
                        setInventory(decryptedData)
                        if (user.role === 'admin') setLoading(false)
                        if (user.role === 'supervisor') {
                            const BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + user._id + '/' + 'supervisor';
                            axios.get(BranchURL)
                            .then((branch) => {
                                const branchFound = decryptCollection(branch.data.branch)
                                setBranch(branchFound.collection)
                                setLoading(false)
                            })
                            .catch((error) => {
                                console.error('Error getting branch with supervisor _id: ', error)
                            })
                        }
                        if (user.role === 'cashier'){
                            const BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + user._id + '/' + 'employee';
                            axios.get(BranchURL)
                            .then((branch) => {
                                const branchFound = decryptCollection(branch.data.branch)
                                setBranch(branchFound.collection)
                                setLoading(false)
                            })
                            .catch((error) => {
                                console.error('Error getting branch with employee _id: ', error)
                            })
                        }
                    })
                    .catch((error) => {
                        console.error('Error getting all inventories: ', error)
                    })
            })
            .catch((error) => {
                console.error('Error retrieving sales: ', error)
            })

        axios.get(process.env.REACT_APP_PURCHASE_URL)
            .then((res) => {
                const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.purchases, secretKey).toString(CryptoJS.enc.Utf8));
                setExpenses(decryptedData)
            })
            .catch((error) => {
                console.error('Error retrieving purchases: ', error)
            })
    }, [])

    return (
        <div className="MainDash">

            {selectedMenuItem === "Dashboard" && (
                <div className="dashBoardDiv">
                    {loading === true ? (
                        <BarLoader
                            cssOverride={override}
                            color="green" />
                    ) : (
                        <>
                            <div className="Component">
                                <b><h1>{capitalizedRole} DASHBOARD</h1></b>
                                <Cards user={user} sales={sales} inventory={inventory} expenses={expenses} branch={branch}/>
                            </div>

                            <div className="TableAndChart Component">
                                <Table user={user} sales={sales} branch={branch}/>
                                <Chart user={user} sales={sales} branch={branch}/>
                            </div>
                        </>

                    )}

                </div>)}

            {selectedMenuItem === "Branches" && (
                <div>
                    <BranchTable user={data} setUser={setUser} />
                </div>)}

            {selectedMenuItem === "Employees" && (
                <div>
                    <EmployeeTable user={data} setUser={setUser} />
                </div>)}

            {selectedMenuItem === "Products" && (
                <div>
                    <ProductsTable user={data} setUser={setUser} />
                </div>)}

            {selectedMenuItem === "Inventory" && (
                <div>
                    <InventoryTable user={data} setUser={setUser} />
                </div>)}

            {selectedMenuItem === "Sales" && (
                <div>
                    <SalesTable user={data} setUser={setUser} />
                </div>)}

            {selectedMenuItem === "About" && (
                <div>
                    <About user={data} setUser={setUser} />
                </div>)}

        </div>
    )
}

export default MainDash