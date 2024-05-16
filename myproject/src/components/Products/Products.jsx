import './Products.css'
import { useState, useEffect } from 'react';
import { ProductsColumns, ProductsData, CustomStyle } from '../../Data/Data';
import { decryptCollection } from '../../functions/DecryptUser';
import { arrangeArray } from "../../functions/SimplifyData";
import { exportCSV } from '../../functions/FileValidation';
import DataTable from 'react-data-table-component'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddProduct from './AddProduct';
import axios from 'axios';
import BarLoader from 'react-spinners/BarLoader';

function ProductsTable({ user, setUser }) {
    const [records, setRecords] = useState([])
    const [productCollection, setProductCollection] = useState(null)
    const [loading, setLoading] = useState(false)
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        width: '350px'
    };

    useEffect(() => {
        setLoading(true)
        axios.get(process.env.REACT_APP_PRODUCTS_URL)
            .then(res => {
                const data = decryptCollection(res.data.products)
                const arrangedArray = arrangeArray(data.collection)
                setProductCollection(arrangedArray)
                setLoading(false)
                setRecords(arrangedArray)
            })
            .catch(err => console.log('Error retrieving product collection: ', err))
    }, [])

    function handleFilter(event) {
        const newData = productCollection.filter(row => {
          const lowerCaseSearch = event.target.value.toLowerCase();
          return (
            row.product_name.toLowerCase().includes(lowerCaseSearch) ||
            row.price.toString().includes(lowerCaseSearch) ||
            row._id.toLowerCase().includes(lowerCaseSearch) ||
            row.category.toLowerCase().includes(lowerCaseSearch)
          );
        });
        setRecords(newData);
      }

    function exportToCSV(){
        const csvData = productCollection.map(product => ({
                ID: product._id,
                Name: product.product_name,
                Price: product.selling_price,
                Description: product.product_description   
        })) 

        exportCSV(csvData,"products")
    }

    return (
        <div className="container mt-5">

            {loading ? (
                <BarLoader
                    cssOverride={override}
                    color="brown" />
            ) : (
                <div className="productDataTable">
                    <h1>PRODUCT TABLE</h1>
                    <div className="text-end">
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            onChange={handleFilter}
                            className="filter"
                        />
                        <AddProduct user={user} setUser={setUser} />
                        <Button variant="contained" color="secondary" className="MuiButton-contained csv" onClick={exportToCSV}>Export as CSV</Button>
                    </div>
                    {/* // Display the DataTable when data is ready */}
                    <DataTable
                        columns={ProductsColumns}
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

export default ProductsTable;