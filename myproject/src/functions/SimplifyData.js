
async function simplifyData(data) {
  const simplifiedArray = []
  data.forEach((employee) => {
    const fullName = employee.first_name + " " + employee.last_name
    const address = employee.barangay + ", " + employee.municipality + ", " + employee.province
    const id = employee._id
    const employeeObject = {
      _id: id,
      name: fullName,
      role: employee.role,
      address: address,
      email_address: employee.email_address,
      gender: employee.gender,
      contact_number: "0" + employee.contact_number,
      archived: employee.archived
    }
    simplifiedArray.push(employeeObject)
  })
  return simplifiedArray;
}

function arrangeArray(array) {
  const arrangedArray = []
  array.reverse().map(document => {
    arrangedArray.push(document)
  })
  return arrangedArray;
}

function simplifyBranchData(data) {
  const simplifiedArray = []
  data.collection.forEach((branch) => {
    if (branch.supervisor === null || branch.supervisor === "") {
      const address = branch.barangay + ", " + branch.municipality + ", " + branch.province
      const id = branch._id
      const branchObject = {
        _id: id,
        branch_name: branch.branch_name,
        supervisor: 'no supervisor',
        address: address,
        employees: branch.employees.length,
        opening_date: branch.opening_date,
        archived: branch.archived
      }
      simplifiedArray.push(branchObject)
    } else {
      const supervisor = branch.supervisor.first_name + " " + branch.supervisor.last_name
      const address = branch.barangay + ", " + branch.municipality + ", " + branch.province
      const id = branch._id
      const branchObject = {
        _id: id,
        branch_name: branch.branch_name,
        supervisor: supervisor,
        address: address,
        employees: branch.employees.length,
        opening_date: branch.opening_date,
        archived: branch.archived
      }
      simplifiedArray.push(branchObject)
    }

  })

  return simplifiedArray;
}

function simplifyInventoryData(data) {
  const simplifiedArray = []
  data.forEach((inventory) => {

    let last_restock = ''
    if (inventory.last_restock === null) {
      last_restock = 'No recent restock'
    } else {
      last_restock = inventory.last_restock
    }

    let className = ''
    switch (inventory.status) {
      case 'Out of stock':
        className = 'out-of-stock'
        break;
      case 'Low stock':
        className = 'low-stock'
        break;
      default:
        className = 'in-stock'
    }

    if (inventory.stock === 0) {
      className = 'out-of-stock'
    }


    const inventoryObject = {
      _id: inventory.product._id,
      product: inventory.product.product_name,
      last_restock: last_restock,
      value: '₱ ' + (inventory.stock * inventory.product.price),
      quantity: inventory.stock,
      status: inventory.status,
      class: className,
      price: inventory.product.price,
      category: inventory.product.category
    }

    simplifiedArray.push(inventoryObject)

  })

  return simplifiedArray;
}

function simplifyInventoryDataAdmin(data) {
  const simplifiedArray = []
  data.forEach((inventory) => {

    let supervisor = ''
    const address = inventory.branch_id.barangay + ", " + inventory.branch_id.municipality + ", " + inventory.branch_id.province
    let total_value = 0
    if (inventory.branch_id.supervisor === null) {
      supervisor = 'no supervisor'
    } else {
      supervisor = inventory.branch_id.supervisor.first_name + " " + inventory.branch_id.supervisor.middle_name + " " + inventory.branch_id.supervisor.last_name
    }

    inventory.products.forEach((product) => {
      const value = product.stock * product.product.price
      total_value = total_value + value
    })

    const inventoryObject = {
      _id: inventory.branch_id._id,
      branch_name: inventory.branch_id.branch_name,
      supervisor: supervisor,
      address: address,
      total_value: total_value,
      archived: inventory.archived
    }

    simplifiedArray.push(inventoryObject)

  })

  return simplifiedArray
}

function simplifySalesData(data) {

  const simplifiedArray = []
  data.forEach((sale) => {
    const object = {
      branch_id: sale.branch._id,
      branch_name: sale.branch.branch_name,
      selling_id: sale.selling_id,
      no_orders: sale.products.length,
      date_of_sale: sale.date_added,
      products_sold: sale.total_quantity,
      products: sale.products,
      total_amount: sale.total_amount,
      in_charge: `${sale.in_charge.first_name} ${sale.in_charge.middle_name} ${sale.in_charge.last_name}`,
      _id: sale.in_charge._id,
      role: sale.in_charge.role
    }

    simplifiedArray.push(object)
  })

  return simplifiedArray
}

function simplifyAdminSales(branches, sales, rawBranch, inventory) {
  const simplifiedArray = []
  console.log('inventory sa admin',inventory)
  branches.forEach((branch,index) => {
    const branchID = branch._id
    const filteredSales = sales.filter(sale => sale.branch_id === branchID) //filters the sales to only have sales of the branch
    const foundBranch = rawBranch.find(branch => branch._id === branchID)
    const inventoryFound = inventory.find(inventory => inventory.branch_id === branchID)
    console.log(`supervisorens: ${foundBranch.supervisor}`)
    const supervisor = foundBranch.supervisor; //sets the admin for supervisor access
    let totalQuantity = 0;
    let totalAmount = 0;

    //totals all the quantity and sales of the branch
    filteredSales.forEach((sale) => {
      totalQuantity += sale.products_sold;
      totalAmount += sale.total_amount
    })
    const object = {
      branch_id: branch._id,
      branch_name: branch.branch_name,
      products_sold: totalQuantity,
      total_sales: totalAmount,
      user: {
        user: supervisor
      },
      inventory: [inventoryFound]
    }

    simplifiedArray.push(object)

  })
  return simplifiedArray;
}

module.exports = { simplifyData, arrangeArray, simplifyBranchData, simplifyInventoryData, simplifyInventoryDataAdmin, simplifySalesData, simplifyAdminSales }