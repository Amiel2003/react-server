import { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Branches.css'

function AddBranchEmployee({employees, employeeList,setEmployeeList,setErrorMessage}) {
    const [buttonDisabled,setButtonDisabled] = useState(true)

    const handleAddBranchEmployee = () => {
        setEmployeeList([...employeeList, {employee: ''}])
        setButtonDisabled(true)
    }
    const handleRemoveBranchEmployee = (index) => {
        const list = [...employeeList]
        list.splice(index,1)
        setEmployeeList(list)
        if(index === 0){
          const value = employeeList[index].employeeID
          const isEmployeeValid = employees.some((employeeObj) => employeeObj._id === value);
          setButtonDisabled(isEmployeeValid ? false : true);
        }else{
          const value = employeeList[index-1].employeeID
          const isEmployeeValid = employees.some((employeeObj) => employeeObj._id === value);
          setButtonDisabled(isEmployeeValid ? false : true);
        }
       
    }

    const handleEmployeeChange = (e,index) => {
      const {name, value} = e.target;
      const list = [...employeeList]
      list[index][name] = value
      
      let isAvailable = true;
      const isEmployeeValid = employees.some((employeeObj) => employeeObj._id === value);
      if(isEmployeeValid){
        const matchingEmployee = employees.find((employeeObj) => employeeObj._id === value);
        if(matchingEmployee.isAvailable === true){
          list[index].employee = matchingEmployee ? matchingEmployee.name : '';
        }else{
          isAvailable = false
        }
      }else {
        // Clear the employee name if the input is not valid
        list[index].employee = '';
      }

      const isEmployeeDuplicated = employeeList.some((employeeObj, i) => {
        return i !== index && employeeObj.employeeID === value;
      });


      setErrorMessage(
        value.trim() === ''
          ? ''
          : isEmployeeDuplicated
          ? `Entry ${index + 1} is duplicated`
          : isAvailable === false
          ? `Employee is already assigned to a branch`
          : isEmployeeValid === false
          ? `Entry ${index + 1} not found`
          : ''
      );
      
      if(isEmployeeDuplicated || isAvailable === false){
        setButtonDisabled(true)
      }else{
        setButtonDisabled(!isEmployeeValid)
      }
      setEmployeeList(list)
    }


   return (
    <div className="branchEmployeeDiv">
      {employeeList.map((singleEmployee, index) => (
        <div key={index} className="branchEmployeeSection">
          <div className="branchEmployeeField">
            
            <input name='employeeID' type="number" className='form-control' placeholder='Employee ID' 
            value={singleEmployee.employeeID}
            onChange={(e) => handleEmployeeChange(e,index)} style={{width:'40%'}}/>
            <input name='employee' type="text" className='form-control' placeholder='Employee Name' 
            value={singleEmployee.employee} disabled='true'
            />
            {employeeList.length > 1 && (
                <Button variant='danger' onClick={() => handleRemoveBranchEmployee(index)}>Remove</Button>
            )}
            {employeeList.length === 1 && (
                <Button variant='danger' disabled='true'>Remove</Button>
            )}
          </div>
          {employeeList.length -1 === index && employeeList.length < 5 &&(
          <div className="addAnotherEmployee">
          <Button 
          variant='success' 
          style={{width: '100%'}}
          onClick={handleAddBranchEmployee}
          disabled={buttonDisabled}>Add employee</Button>
            </div>)}
          
        </div>
      ))}
    </div>
  );
  
}

export default AddBranchEmployee;