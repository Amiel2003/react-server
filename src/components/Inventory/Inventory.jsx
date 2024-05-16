import React, { useState, useEffect } from "react";
import AdminInventory from "./AdminInventory";
import SupervisorInventory from "./SupervisorInventory";

function Inventory({ user, setUser }) {
    const [records, setRecords] = useState([])
    const [employeeCollection, setEmployeeCollection] = useState(null)
    const [EmployeeData, setEmployeeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    return (
        <div>
            {user.user.role === 'admin' ? (
                <div>
                    <AdminInventory user={user}/>
                </div>
            ) : (
                <div>
                    <SupervisorInventory user={user}/>
                </div>
            )}
        </div>
    )
}

export default Inventory