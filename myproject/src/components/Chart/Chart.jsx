import React, { useState } from "react";
import './Chart.css'
import { CardsData } from "../../Data/Data";
import Charts from 'react-apexcharts'

const Chart = ({ user, sales, branch }) => {
    const [sort, setSort] = useState('All time')
    const dateArray = []
    const saleArray = []
    const thisWeekDates = []
    const thisWeekSales = []
    const lastWeekDates = []
    const lastWeekSales = []
    const lastMonthDates = []
    const lastMonthSales = []

    //this week
    const currentDate = new Date();
    const thisWeek = new Date(currentDate)
    thisWeek.setDate(currentDate.getDate() - currentDate.getDay())

    //last week
    const lastWeek = new Date()
    lastWeek.setDate(currentDate.getDate() - 7)
    const startOfThisWeek = new Date(currentDate);
    startOfThisWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the beginning of the current week (Sunday)
    startOfThisWeek.setHours(0, 0, 0, 0);

    //last month
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(currentDate.getMonth() - 1); // Set to the start of the last month
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    switch (user.role) {
        case 'admin':
            sales.forEach(sale => {
                const saleDate = new Date(sale.date_added)
                dateArray.push(sale.date_added)
                saleArray.push(sale.total_amount)
                
                pushArrays(saleDate,sale)
                
            });
            break;
        case 'supervisor':
            const branchID = branch._id
            const filteredSales = sales.filter(sale => sale.branch._id === branchID)
            filteredSales.forEach(sale => {
                const saleDate = new Date(sale.date_added)
                dateArray.push(sale.date_added)
                saleArray.push(sale.total_amount)
                
                pushArrays(saleDate,sale)
            });
            break;
        case 'cashier':
            const branchIDCashier = branch._id
            const filteredSalesCashier = sales.filter(sale => sale.branch._id === branchIDCashier)
            filteredSalesCashier.forEach(sale => {
                const saleDate = new Date(sale.date_added)
                dateArray.push(sale.date_added)
                saleArray.push(sale.total_amount)
                
                pushArrays(saleDate,sale)
            });
            break;
        default:
            break;
    }

    function pushArrays(saleDate, sale){
        //push this week's data
        if (saleDate >= thisWeek && saleDate <= currentDate) {
            thisWeekDates.push(sale.date_added)
            thisWeekSales.push(sale.total_amount)
        }

        //push last week's data
        if(saleDate >= lastWeek && saleDate < currentDate && saleDate < startOfThisWeek){
            lastWeekDates.push(sale.date_added)
            lastWeekSales.push(sale.total_amount)
        }

        //push last month's data
        if(saleDate >= lastMonth && saleDate < startOfCurrentMonth){
            lastMonthDates.push(sale.date_added)
            lastMonthSales.push(sale.total_amount)
        }
    }

    const data = {
        options: {
            chart: {
                type: "area",
                height: "auto",
            },
            dropShadow: {
                enabled: false,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blue: 3,
                color: "#000",
                opacity: 0.35,
            },
            fill: {
                colors: ["#952323"],
                type: "gradient",
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
                colors: ["#c7c49a"],
            },
            tooltip: {
                x: {
                    format: "dd/MM/yy HH:mm",
                }
            },
            grid: {
                show: true,
            },
            xaxis: {
                type: "datetime",
                categories: (sort === 'All time') ? dateArray : (sort === 'This week') ? 
                thisWeekDates : (sort === 'Last week') ? lastWeekDates : (sort === 'Last month') ? 
                lastMonthDates : [],
            }
        },
        series: [
            {
                name: "Sales",
                data: (sort === 'All time') ? saleArray : (sort === 'This week') ? 
                thisWeekSales : (sort === 'Last week') ? lastWeekSales : (sort === 'Last month') ? 
                lastMonthSales : [],
            },
        ],
    }

    return (
        <div className="chartContainer">
            <div className="chartHeader"><h3>Sales Chart</h3>
                <select className="form-control" onChange={(e) => setSort(e.target.value)}>
                    <option value="All time">All time</option>
                    <option value="This week">This week</option>
                    <option value="Last week">Last Week</option>
                    <option value="Last month">Last Month</option>
                </select>
            </div>
            <Charts series={data.series} className="ApexChart" type="area" options={data.options} />
        </div>
    )
}

export default Chart