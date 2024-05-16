import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component'
import { BranchColumns, CustomStyle } from "../../Data/Data";
import { decryptCollection } from "../../functions/DecryptUser";
import { simplifyBranchData, arrangeArray } from "../../functions/SimplifyData";
import { exportCSV } from '../../functions/FileValidation';
import './Branches.css'
import AddBranch from "./AddBranch";
import ArchivedBranches from "./ArchivedBranches";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from "axios";
import BarLoader from "react-spinners/BarLoader";
import { UilImport } from "@iconscout/react-unicons";

function BranchTable({ user, setUser }) {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [branchCollection, setBranchCollection] = useState(null)
    const [branchData, setBranchData] = useState([])
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    function handleFilter(event) {

        const newData = branchData.filter(row => {
            const lowerCaseSearch = event.target.value.toLowerCase();
            return (
                row._id.toLowerCase().includes(lowerCaseSearch) ||
                row.supervisor.toLowerCase().includes(lowerCaseSearch) ||
                row.address.toLowerCase().includes(lowerCaseSearch) ||
                row.branch_name.toLowerCase().includes(lowerCaseSearch)
            );
        });
        setRecords(newData);
    }

    useEffect(() => {
        retrieveBranches()
    }, [])

    function retrieveBranches() {
        setLoading(true)
        axios.get(process.env.REACT_APP_BRANCHES_URL)
            .then((res) => {
                const data = decryptCollection(res.data.branches)
                const simplifiedData = simplifyBranchData(data)
                const filteredArray = simplifiedData.filter(item => !item.archived);
                const arrangedArray = arrangeArray(filteredArray)
                setBranchCollection(data.collection)
                setRecords(arrangedArray)
                setBranchData(arrangedArray)
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error retrieving branches collection ', error)
            })
    }

    function exportToCSV() {

        const csvData = branchCollection.map(branch => ({
            ID: branch._id,
            supervisor: branch.supervisor ? branch.supervisor.first_name + " " + branch.supervisor.last_name : 'no supervisor',
            barangay: branch.barangay,
            municipality: branch.municipality,
            province: branch.province,
            opening_date: branch.opening_date,
            date_added: branch.date_added,
            employees: branch.employees.map(employee => employee.first_name + " " + employee.last_name).join(', ')
        }))

        exportCSV(csvData, 'branches')
    }

    return (
        <div className="container mt-5">
            {loading ? (
                // Display a loading indicator while data is being fetched
                <BarLoader
                    cssOverride={override}
                    color="green" />
            ) : (
                <div>
                    <h1>BRANCH TABLE</h1>
                    <div className="text-end">
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            onChange={handleFilter}
                            className="filter"
                        />
                        <AddBranch user={user} setUser={setUser} />
                        <ArchivedBranches user={user} setUser={setUser}/>
                        <Button variant="contained" color="secondary" className="MuiButton-contained csv" onClick={exportToCSV}>
                            <div className="import">
                                <UilImport size='18' />
                                <div>
                                    Export as CSV
                                </div>
                            </div>
                        </Button>
                    </div>
                    <div className="branchDataTable">
                        <DataTable
                            columns={BranchColumns}
                            data={records}
                            fixedHeader
                            pagination
                            customStyles={CustomStyle}
                            paginationPerPage={8}
                        // paginationRowsPerPageOptions={[8, 16, , 40]}
                        >
                        </DataTable>
                    </div>
                </div>
            )}

        </div>
    )
}

export default BranchTable