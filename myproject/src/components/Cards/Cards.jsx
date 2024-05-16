import React, { useState } from "react";
import './Cards.css'
import Card from "../Card/Card";
import {
  UilClipboardAlt,
  UilMoneyWithdrawal,
  UilBill,
} from "@iconscout/react-unicons";

const Cards = ({ user, sales, inventory, expenses, branch }) => {
  let [totalSales, setTotalSales] = useState(0)
  let [totalExpenses, setTotalExpenses] = useState(0)
  let [totalInventory, setTotalInventory] = useState(0)

  switch (user.role) {
    case 'admin':
      sales.forEach(sale => {
        totalSales += sale.total_amount
      });
      expenses.forEach(expense => {
        totalExpenses += expense.total_amount
      })
      inventory.forEach(inv => {
        inv.products.forEach(product => {
          totalInventory += product.stock
        })
      })
      break;
    case 'supervisor':
      const branchID = branch._id
      const filteredSales = sales.filter(sale => sale.branch._id === branchID)
      const filteredExpenses = expenses.filter(expense => expense.branch_id._id === branchID)
      const filteredInventory = inventory.find((invObj) => invObj.branch_id._id === branchID)

      filteredSales.forEach(sale => {
        totalSales += sale.total_amount
      });

      filteredExpenses.forEach(expense => {
        totalExpenses += expense.total_amount
      })

      filteredInventory.products.forEach(product => {
        totalInventory += product.stock
      })

      break;
    case 'cashier':
      console.log('employerns')
      const branchIDCashier = branch._id
      const filteredSalesCashier = sales.filter(sale => sale.branch._id === branchIDCashier)
      const filteredExpensesCashier = expenses.filter(expense => expense.branch_id._id === branchIDCashier)
      const filteredInventoryCashier = inventory.find((invObj) => invObj.branch_id._id === branchIDCashier)

      filteredSalesCashier.forEach(sale => {
        totalSales += sale.total_amount
      });

      filteredExpensesCashier.forEach(expense => {
        totalExpenses += expense.total_amount
      })

      filteredInventoryCashier.products.forEach(product => {
        totalInventory += product.stock
      })
      break;
    default:
      break
  }

  const CardsData = [
    {
      title: "Sales",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: 70,
      value: totalSales,
      png: UilBill,
      series: [
        {
          name: "Sales",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
    },
    {
      title: "Inventory",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: 80,
      value: totalInventory,
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Inventory",
          data: [10, 100, 50, 70, 80, 30, 40],
        },
      ],
    },
    {
      title: "Expenses",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: 60,
      value: totalExpenses,
      png: UilClipboardAlt,
      series: [
        {
          name: "Expenses",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
    },
  ]
  return (
    <div className="Cards">
      {CardsData.map((card, id) => {
        return (
          <div className="parentContainer">
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Cards