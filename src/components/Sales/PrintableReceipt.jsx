import React, { useEffect } from 'react';
import './Sales.css';
import { formatDateToLetters } from '../../functions/FormatDate';
import { decryptCollection } from '../../functions/DecryptUser';
import { useState } from 'react';
import axios from 'axios';
import BarLoader from 'react-spinners/BarLoader';

const PrintableReceipt = React.forwardRef(({ user, id, totalQuantity, totalAmount, products, view, date }, ref) => {

    const [branch,setBranch] = useState([])
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
      };
    const [loading, setLoading] = useState(true)
    

    useEffect(()=>{
        let BranchURL = ''
        if(user.user.role === 'supervisor'){
            BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + user.user._id + '/' + 'supervisor';
        }else{
            BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + user.user._id + '/' + 'employee';
        }
        axios.get(BranchURL)
        .then((branch) => {
            const branchFound = decryptCollection(branch.data.branch)
            setBranch(branchFound.collection)
            setLoading(false)
        })
        .catch((error) => {
            console.error('Error getting branch with supervisor._id: ', error)
        })
    },[])

    return (
        <div ref={ref} className="printable-receipt">

            {loading ? (
                <BarLoader
                cssOverride={override}
                color="blue" />
            ):(
                <table className="supervisor-table">
            <h3>Receipt</h3>
                <tbody>
                    <tr>
                        <td><b>Products</b></td>
                        <td><b>No.</b></td>
                    </tr>
                    {products.length > 0 ? (
                        products.map((product) => {
                            return (
                                <tr>
                                    <td>{product.product_name}</td>
                                    <td>{product.quantity}px</td>
                                </tr>
                            );
                        })
                    ) : (null)}
                    <br /><br />
                    <tr>
                        <td>Sale ID:</td>
                        <td>{id}</td>
                    </tr>
                    <tr>
                        <td>Total Items:</td>
                        <td>
                            {totalQuantity}
                        </td>
                    </tr>
                    <tr>
                        <td>Date:</td>
                        <td>
                            {formatDateToLetters(date)}                            
                        </td>
                    </tr>
                    <tr>
                        <td>Total Amount:</td>
                        <td>
                            ₱{totalAmount}
                        </td>
                    </tr>
                    <tr>
                        <td>In Charge:</td>
                        <td>
                            {user.user.first_name} {user.user.last_name}
                        </td>
                    </tr>
                    <tr>
                        <td>Branch:</td>
                        <td>
                            {branch.branch_name}
                        </td>
                    </tr>
                    <tr>
                        <td>Address:</td>
                        <td>
                            {branch.barangay} {branch.municipality} {branch.province}
                        </td>
                    </tr>
                </tbody>
            </table>
            )}

            
        </div>
    );
});

export default PrintableReceipt;
