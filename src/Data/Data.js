// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilMoneyWithdrawal,
  UilBill,
  UilBuilding,
  UilQuestionCircle,
} from "@iconscout/react-unicons";
import Button from '@mui/material/Button';
import { formatDateAsText, formatDateToLetters, removeTime } from "../functions/FormatDate";
import { returnEmployeeToActive, returnBranchToActive } from "../functions/ReturnToActive";
import EmployeeDetails from "../components/Details/EmployeeDetails";
import BranchDetails from '../components/Details/BranchDetails'
import ProductDetails from "../components/Details/ProductDetails";
import ViewInventory from "../components/Inventory/ViewInventory";
import ViewSale from "../components/Sales/ViewSale";
import AddSale from "../components/Sales/AddSale";
import ViewSalesAsAdmin from "../components/Sales/ViewSalesAsAdmin";

export const SidebarData = [
  {
    roles: ["admin", "supervisor", "cashier"],
    icon: UilEstate,
    heading: "Dashboard",
    link: "/dashboard"
  },
  {
    roles: ["admin"],
    icon: UilBuilding,
    heading: "Branches",
    link: "/branches"
  },
  {
    roles: ["admin", "supervisor"],
    icon: UilUsersAlt,
    heading: "Employees",
    link: "/employees"
  },
  {
    roles: ["admin", "supervisor"],
    icon: UilPackage,
    heading: "Products",
    link: "/products"
  },
  {
    roles: ["admin", "supervisor"],
    icon: UilChart,
    heading: "Inventory",
    link: "/inventory"
  },
  {
    roles: ["admin", "supervisor", "cashier"],
    icon: UilBill,
    heading: "Sales",
    link: "/sales"
  },
  {
    roles: ["admin", "supervisor", "cashier"],
    icon: UilQuestionCircle,
    heading: "About",
    link: "/about"
  },
];
export const CardsData = [
  {
    title: "Sales",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "25,970",
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
    value: "14,270",
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
    value: "4,270",
    png: UilClipboardAlt,
    series: [
      {
        name: "Expenses",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
]

// Recent Update Card Data
export const UpdatesData = [
  {
    type: "Employee",
    noti: "Juhanie love Rey Nante",
    time: "25 seconds ago",
  },
  {
    type: "Product",
    noti: "Added Lechon Kawali in products",
    time: "30 minutes ago",
  }

];

//Custom data table style
export const CustomStyle = {
  rows: {
    style: {
      fontSize: '13px',
    }
  }

}

//Branch information
export const BranchColumns = [
  {
    name: 'Branch Name',
    selector: row => row.branch_name,
  },
  {
    name: 'Supervisor',
    selector: row => row.supervisor,
  },
  {
    name: 'Address',
    selector: row => row.address
  },
  {
    name: 'No. of Employees',
    selector: row => row.employees
  },
  {
    name: 'Opening Date',
    selector: row => formatDateAsText(new Date(row.opening_date)),
  },
  {
    name: 'Details',
    cell: (row) => <BranchDetails id={row._id} />,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
]

export const ProductsColumns = [
  {
    name: 'ID',
    selector: row => row._id
  },
  {
    name: 'Product Name',
    selector: row => row.product_name
  },
  {
    name: 'Price',
    selector: row => '₱' + row.price
  },
  {
    name: 'Category',
    selector: row => row.category
  },
  {
    name: 'Description',
    selector: (row) => {
      const maxLength = 50; // You can change this to your desired character limit
      if (row.product_description.length > maxLength) {
        return row.product_description.substring(0, maxLength) + '...';
      } else {
        return row.product_description;
      }
    },
  },
  {
    name: 'Details',
    cell: (row) => <ProductDetails id={row._id} />,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
]

//Employee information
export const EmployeeColumns = [
  {
    name: 'ID',
    cell: (row) => <b>#{row._id}</b>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name: 'Name',
    selector: row => row.name,
  },
  {
    name: 'Email',
    selector: row => row.email_address
  },
  {
    name: 'Gender',
    selector: row => row.gender
  },
  {
    name: 'Role',
    selector: row => row.role
  },
  {
    name: 'Details',
    cell: (row) => <EmployeeDetails id={row._id} />,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
]

export const SupervisorInventoryColumns = [
  {
    name: 'Item ID',
    cell: (row) => <b>#{row._id}</b>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name: 'Item',
    selector: row => row.product
  },
  
  {
    name: 'Value',
    selector: row => row.value
  },
  {
    name: 'Stock',
    selector: row => row.quantity
  },
  {
    name: 'Last Restock',
    cell: (row) => (row.last_restock === 'No recent restock') ? <div className='no-restock'>No restock</div> : <div className="restock-date">{removeTime(row.last_restock)}</div>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    // selector: row => (row.last_restock !== 'No recent restock') ? formatDateToLetters(row.last_restock) : row.last_restock
  },
  {
    name: 'Status',
    cell: (row) => <div className={row.class}>{row.status}</div>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
]

export const AdminInventoryColumns = [
  {
    name: 'Branch Name',
    selector: row => row.branch_name
  },
  {
    name: 'Supervisor',
    selector: row => row.supervisor
  },
  {
    name: 'Address',
    selector: row => row.address
  },
  {
    name: 'Current Inventory Value',
    selector: row => '₱'+row.total_value
  },
  {
    name: 'Details',
    cell: (row) => <ViewInventory id={row._id} name={row.branch_name} />,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
]
export const positionData = [
  {
    id: 2,
    name: "supervisor",
    value: "supervisor"
  },
  {
    id: 3,
    name: "cashier",
    value: "cashier"
  },
  {
    id: 4,
    name: "delivery",
    value: "delivery"
  },
  {
    id: 5,
    name: "rotiseree cook",
    value: "rotiseree cook"
  },
]

export const NonAdminSalesColumn = [
  {
    name: 'Date',
    selector: row => formatDateToLetters(row.date_of_sale)
  },
  {
    name: 'No. orders',
    selector: row => row.no_orders
  },
  {
    name: 'Products sold',
    selector: row => row.products_sold
  },
  {
    name: 'Total Price',
    selector: row => "₱"+row.total_amount
  },
  {
    name: 'In charge',
    selector: row => row.in_charge
  },
  {
    name: 'Details',
    cell: (row) => <ViewSale object={row} />,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
]

export const ArchivedEmployeeColumns = [
  {
    name: 'ID',
    cell: (row) => <b>#{row._id}</b>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name: 'Name',
    selector: row => row.name,
  },
  {
    name: 'Email',
    selector: row => row.email_address
  },
  {
    name: 'Gender',
    selector: row => row.gender
  },
  {
    name: 'Role',
    selector: row => row.role
  },
  {
    name: 'Action',
    cell: (row) => (
      <Button
      variant="contained"
      color="success" 
      onClick={() => returnEmployeeToActive(row)}>
        Activate
      </Button>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
]

export const ArchivedBranchColumns = [
  {
    name: 'Branch Name',
    selector: row => row.branch_name,
  },
  {
    name: 'Supervisor',
    selector: row => row.supervisor,
  },
  {
    name: 'Address',
    selector: row => row.address
  },
  {
    name: 'No. of Employees',
    selector: row => row.employees
  },
  {
    name: 'Opening Date',
    selector: row => formatDateAsText(new Date(row.opening_date)),
  },
  {
    name: 'Action',
    cell: (row) => (
      <Button
      variant="contained"
      color="success" 
      onClick={() => returnBranchToActive(row)}>
        Activate
      </Button>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
]

export const AdminSalesColumn = [
  {
    name: 'Branch',
    selector: row => row.branch_name
  },
  {
    name: 'Products Sold',
    selector: row => row.products_sold
  },
  {
    name: 'Total Sales',
    selector: row => '₱'+row.total_sales
  },
  {
    name: 'Supervisor',
    selector: row => row.user.user.first_name + " " + row.user.user.middle_name + " " + row.user.user.last_name
  },
  // {
  //   cell: (row) => {
  //     return row.user.user === null ? (
  //       <div><center style={{fontSize:'12px',color: 'rgb(168, 174, 174)'}}>Assign a supervisor</center></div>
  //     ) : (
  //       <AddSale user={row.user} inventory={row.inventory}/>
  //     );
  //   },
  //   ignoreRowClick: true,
  //   allowOverflow: true,
  //   button: true,
  // },  
  // {
  //   cell: (row) => <ViewSalesAsAdmin id={row.branch_id}/>,
  //   ignoreRowClick: true,
  //   allowOverflow: true,
  //   button: true,
  // }
]