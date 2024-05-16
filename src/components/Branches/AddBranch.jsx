import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import AddBranchEmployee from './AddBranchEmployee';
import { verifySidebar } from '../../functions/AuthUtils';
import { useNavigate } from 'react-router-dom';
import { decryptCollection } from '../../functions/DecryptUser';
import { simplifyData } from '../../functions/SimplifyData';
import CryptoJS from 'crypto-js';
import MuiButton from '@mui/material/Button';

function AddBranch({ user, setUser }) {
  const [employeeList, setEmployeeList] = useState([{ employee: '' }])
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)
  const [employeeCollection, setEmployeeCollection] = useState(null)
  const [rawEmployeeCollection, setRawEmployeeCollection] = useState(null)
  const [supervisorArray, setSupervisorArray] = useState(null)
  const [supervisorMessage, setSupervisorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [branchID, setBranchID] = useState('')
  const [supervisor, setSupervisor] = useState('')
  const [barangay, setBarangay] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [openingDate, setOpeningDate] = useState('')
  const [branchName, setBranchName] = useState('')
  const [province, setProvince] = useState('')
  const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

  const navigate = useNavigate();
  const handleClose = () => {
    setSupervisorMessage(null)
    setSupervisor('')
    setShow(false)
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    axios.get(process.env.REACT_APP_EMPLOYEES_URL)
      .then((res) => {
        const data = decryptCollection(res.data.employees)
        // const simplifiedArray = simplifyData(data.collection)
        simplifyData(data.collection)
          .then((simplifiedArray) => {
            setRawEmployeeCollection(data.collection)
            //remove all accounts with role of 'supervisor' and 'admin'
            const filteredArray = simplifiedArray.filter(obj => obj.role !== 'supervisor' && obj.role !== 'admin');

            //Implement your code here
            axios.get(process.env.REACT_APP_BRANCHES_URL)
              .then((branchRes) => {
                const branches = decryptCollection(branchRes.data.branches)
                const modifiedArray = isEmployeeAvailable(filteredArray, branches.collection)
                console.log(modifiedArray)
                setEmployeeCollection(modifiedArray)
              })
              .catch((error) => {
                console.error('Error retrieving branches to validate employee ID: ', error)
              })

            //set supervisor array
            const supervisorList = setSupervisorList(simplifiedArray)
            setSupervisorArray(supervisorList)
          })
          .catch((error) => {
            console.error('Error retrieving employee collection ', error)
          })
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, []);

  function isEmployeeAvailable(employeeArray, branchData) {
    const modifiedArray = []

    employeeArray.map(employee => {
      let available = true
      for (const branch of branchData) {
        if (branch.employees.some(branchEmployee => branchEmployee._id === employee._id)) {
          available = false
          break; // Exit the loop when the condition is met
        } else {
          available = true;
        }
      }

      modifiedArray.push({
        ...employee,
        isAvailable: available
      })

    })
    return modifiedArray;
  }

  function setSupervisorList(data) {
    const tmpSupervisorArray = []
    data.forEach((employee) => {
      if (employee.role === 'supervisor') {
        tmpSupervisorArray.push(employee)
      }
    })
    return tmpSupervisorArray;
  }

  function handleSupervisorChange(e) {
    const { value } = e.target;
    const isSupervisorValid = supervisorArray.some((employeeObj) => employeeObj._id === value);

    if (isSupervisorValid) {
      const matchingEmployee = supervisorArray.find((employeeObj) => employeeObj._id === value);
      setSupervisorMessage(null)
      setSupervisor(matchingEmployee)
    } else {
      setSupervisorMessage(
        value.trim() === ''
          ? ''
          : isSupervisorValid === false
            ? `Supervisor not found`
            : ''
      )
      setSupervisor({ name: '' })
    }
  }

  function submit(e) {
    e.preventDefault();
    if (supervisorMessage) {
      setSupervisorMessage('Double check inputs')
    } else {
      try {

        //Stores only the ID of employees
        const employees = []
        if (employeeList[0].employee !== "") {
          employeeList.forEach((employee) => {
            employees.push(employee.employeeID)
          })
        }

        //encrypt before sending to server
        const branch_info = {
          _id: CryptoJS.AES.encrypt(branchID, secretKey).toString(),
          supervisor: CryptoJS.AES.encrypt(supervisor._id, secretKey).toString(),
          barangay: CryptoJS.AES.encrypt(barangay, secretKey).toString(),
          municipality: CryptoJS.AES.encrypt(municipality, secretKey).toString(),
          province: CryptoJS.AES.encrypt(province, secretKey).toString(),
          opening_date: CryptoJS.AES.encrypt(openingDate, secretKey).toString(),
          branch_name: CryptoJS.AES.encrypt(branchName, secretKey).toString(),
          employees: employees.map((value) => encryptArrayElements(value, secretKey))
        }

        axios.post(process.env.REACT_APP_BRANCHES_URL, branch_info)
          .then(res => {
            if (res.data.status !== 200) {
              setSupervisorMessage(res.data.message)
              setSuccessMessage(null)
            } else {
              setSupervisorMessage(null)
              setSuccessMessage(res.data.message)
              setTimeout(() => {
                window.location.reload();
              }, process.env.REACT_APP_RELOAD_TIME);
            }
          })
          .catch(er => console.log(er))

      } catch (error) {
        console.log('Error submitting: ', error)
        setSupervisorMessage('An error occured')
      }
    }

  }

  function encryptArrayElements(value) {
    return CryptoJS.AES.encrypt(value, secretKey).toString();
  }

  return (
    <>
      <MuiButton
        variant="contained" // Use the "contained" variant for a filled button
        color="success" // Use "success" color, or choose another color from the theme
        onClick={() => {
          verifySidebar(user, setUser).then((result) => {
            if (result === false) {
              navigate('/403');
            } else {
              setShow(true);
            }
          });
        }}
      >
        + Add Branch
      </MuiButton>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName='modal-branch'
      >
        <Modal.Header closeButton>
          <Modal.Title>BRANCH FORM</Modal.Title>

        </Modal.Header>
        <Modal.Body>
          <form className='branchForm' onSubmit={(e) => submit(e)}>
            <div className="branchEmployeeTitleDiv">
              <b><h5>Branch Information</h5></b>
              {supervisorMessage && (
                <div className="alert alert-danger supervisor-error" role="alert" id="error-div">
                  <center><b><p id="error-message">{supervisorMessage}</p></b></center>
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success supervisor-success" role="alert" id="error-div">
                  <center><b><p id="error-message">{successMessage}</p></b></center>
                </div>
              )}
            </div>

            <div className="div1">
              <div className="branchIDdiv">
                <label htmlFor="branchID">Branch ID</label><br />
                <input onChange={(e) => setBranchID(e.target.value)} type="number" name="branchID" className='form-control' placeholder='Branch ID' required />
              </div>
              <div className="supervisorIDdiv">
                <label htmlFor="supervisorID">Supervisor ID</label><br />
                <input onChange={(e) => handleSupervisorChange(e)} type="number" name="supervisorID" className='form-control' placeholder='Supervisor ID' required />
              </div>
            </div>
            <div className="div1">
              <div className="barangayDiv">
                <label htmlFor="barangay">Barangay</label><br />
                <input onChange={(e) => setBarangay(e.target.value)} type="text" name="barangay" className='form-control' placeholder='Barangay' required />
              </div>
              <div className="supervisorNameDiv">
                <label htmlFor="supervisorName">Supervisor Name</label><br />
                <input value={supervisor ? supervisor.name : ''} type="text" name="supervisorName" className='form-control' placeholder='Supervisor Name' required disabled='true' />
              </div>
            </div>
            <div className="div1">
              <div className="municipalityDiv">
                <label htmlFor="municipality">Municipality</label><br />
                <input onChange={(e) => setMunicipality(e.target.value)} type="text" name="municipality" className='form-control' placeholder='Municipality' required />
              </div>
              <div className="openingDateDiv">
                <label htmlFor="openingDate">Opening Date</label><br />
                <input onChange={(e) => setOpeningDate(e.target.value)} type="date" name="openingDate" className='form-control' required />
              </div>
            </div>
            <div className="div1 lastDiv">
              <div className="provinceDiv">
                <label htmlFor="province">Province</label><br />
                <input onChange={(e) => setProvince(e.target.value)} type="text" name="province" className='form-control' placeholder='Province' required />
              </div>
              <div className="branchName">
                <label htmlFor="branchName">Branch Name</label><br />
                <input onChange={(e) => setBranchName(e.target.value)} type="text" name="branchName" className='form-control' placeholder='Branch Name' required />
              </div>
            </div>
            <div className="branchEmployeeTitleDiv">
              <b><h5 className='branchEmployeeTitle'>Branch Employee</h5></b>
              {errorMessage && (
                <div className="alert alert-danger branch-employee-error" role="alert" id="error-div">
                  <center><b><p id="error-message">{errorMessage}</p></b></center>
                </div>
              )}
            </div>

            <AddBranchEmployee
              employees={employeeCollection}
              employeeList={employeeList}
              setEmployeeList={setEmployeeList}
              setErrorMessage={setErrorMessage} />

            <div className="buttonsBranch">
              <Button variant="secondary" onClick={handleClose}>Close</Button>
              <Button variant="primary" type='submit'>Save Branch</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

    </>
  );
}

export default AddBranch;