import React, { useState, useEffect } from "react";
import NonAdminSales from "./NonAdminSales";
import AdminSales from "./AdminSales";

function Sales({ user, setUser }) {
    const [records, setRecords] = useState([])
    const [employeeCollection, setEmployeeCollection] = useState(null)
    const [EmployeeData, setEmployeeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [viewInventory, setViewInventory] = useState(false)
    const [supervisor, setSupervisor] = useState('')
    return (
        <div>
            {user.user.role === 'admin' ? (
                <div>
                    {viewInventory === false ? (
                        <AdminSales user={user} setViewInventory={setViewInventory} setSupervisor={setSupervisor}/>
                    ):(
                        <NonAdminSales user={supervisor}/>
                    )}
                </div>
            ) : (
                <div>
                    <NonAdminSales user={user}/>
                </div>
            )}
        </div>
    )
}

export default Sales