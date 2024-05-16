import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component'
import { EmployeeColumns, CustomStyle } from "../../Data/Data";
import './Employees.css'
import AddEmployee from "./AddEmployee";
import ArchivedEmployees from "./ArchivedEmployees";
import { decryptCollection } from '../../functions/DecryptUser';
import { simplifyData, arrangeArray } from '../../functions/SimplifyData';
import { exportCSV } from '../../functions/FileValidation';
import { UilImport } from "@iconscout/react-unicons";
import axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import BarLoader from "react-spinners/BarLoader";

function EmployeeTable({ user, setUser }) {
    const [records, setRecords] = useState([])
    const [employeeCollection, setEmployeeCollection] = useState(null)
    const [EmployeeData, setEmployeeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [branchName, setBranchName] = (useState(null))
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    useEffect(() => {
        axios.get('http://localhost:5000/employees')
            .then((res) => {
                const data = decryptCollection(res.data.employees)
                setEmployeeCollection(data.collection)
                if (user.user.role === 'supervisor') {
                    const BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + user.user._id + '/' + 'supervisor';
                    axios.get(BranchURL)
                        .then((branch) => {
                            const branchFound = decryptCollection(branch.data.branch)
                            if (branchFound.collection) {
                                const employees = {
                                    collection: branchFound.collection.employees
                                }
                                simplifyData(employees.collection)
                                .then((simplifiedArray) => {
                                const arrangedArray = arrangeArray(simplifiedArray)
                                const filteredArray = arrangedArray.filter(item => !item.archived);
                                setBranchName(branchFound.collection.branch_name)
                                setRecords(filteredArray)
                                setEmployeeData(filteredArray)
                                setLoading(false)
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                });
                                

                            } else {
                                console.log('You are not assigned to a branch yet')
                            }
                        })
                        .catch((error) => {
                            setRecords([])
                            console.error('Error getting branch with supervisor._id: ', error)
                        })
                } else {
                    const simplifiedArray = simplifyData(data.collection)
                    simplifyData(data.collection)
                        .then((resolvedArray) => {
                            const arrangedArray = arrangeArray(resolvedArray)
                            const filteredArray = arrangedArray.filter(item => !item.archived);
                            setRecords(filteredArray)
                            setEmployeeData(filteredArray)
                            setLoading(false)
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error retrieving employee collection ', error)
            })
    }, []);

    function handleFilter(event) {
        const newData = EmployeeData.filter(row => {
            return (
                row.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row.email_address.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row.role.toLowerCase().includes(event.target.value.toLowerCase()) ||
                row._id.includes(event.target.value) ||
                row.gender.includes(event.target.value)

            )
        })
        setRecords(newData)
        console.log(EmployeeData)
    }

    function exportToCSV() {
        const csvData = EmployeeData.map(employee => ({
            ID: employee._id,
            FirstName: employee.first_name,
            MiddleName: employee.middle_name,
            LastName: employee.last_name,
            Role: employee.role,
            Email: employee.email_address,
            Gender: employee.gender,
            Citizenship: employee.citizenship,
            Contact: employee.contact_number,
            PostalCode: employee.postal_code,
            Barangay: employee.barangay,
            Municipality: employee.municipality,
            Province: employee.province,
            DateAdded: employee.date_added
        }))

        exportCSV(csvData, 'employees')
    }

    return (
        <div className="container mt-5">

            {loading ? (
                // Display a loading indicator while data is being fetched
                <BarLoader
                    cssOverride={override}
                    color="red" />
            ) : (
                <div>
                    {branchName ? (
                        <div>
                            <h1>{branchName.toUpperCase()} EMPLOYEE TABLE</h1>
                        </div>
                    ) : (
                        <div>
                            <h1>EMPLOYEE TABLE</h1>
                        </div>
                    )}
                    <div className="text-end">
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            onChange={handleFilter}
                            className="filter"
                        />
                        <AddEmployee user={user} setUser={setUser} />
                        <ArchivedEmployees user={user} setUser={setUser} />
                        <Button variant="contained" color="secondary" className="MuiButton-contained csv" onClick={exportToCSV}>
                            <div className="import">
                                <UilImport size='18' />
                                <div>
                                    Export as CSV
                                </div>
                            </div>
                        </Button>
                    </div>
                    <div className="employeeDataTable">
                        {/* // Display the DataTable when data is ready */}
                        <DataTable
                            columns={EmployeeColumns}
                            data={records}
                            fixedHeader
                            pagination
                            customStyles={CustomStyle}
                            paginationPerPage={8}
                            paginationRowsPerPageOptions={[]}
                        >
                        </DataTable>
                    </div>
                </div>
            )}

        </div>
    )
}

export default EmployeeTable