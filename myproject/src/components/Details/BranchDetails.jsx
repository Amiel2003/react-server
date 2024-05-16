import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { formatDateToLetters } from '../../functions/FormatDate';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './BranchDetails.css'
import BounceLoader from 'react-spinners/BarLoader'
import { UilPen, UilPlus, UilTrash, UilCheck, UilX } from "@iconscout/react-unicons";
import BarLoader from 'react-spinners/BarLoader';
import { decryptCollection } from '../../functions/DecryptUser';
import DeleteEmployeeModal from './DeleteEmployeeModal';
import { ToastContainer, toast, Zoom } from 'react-toastify';

function BranchDetails({ id }) {
  const [show, setShow] = useState(false);
  const [barangay, setBarangay] = useState('')
  const [branchID, setBranchID] = useState('')
  const [isEditBarangay, setisEditBarangay] = useState(false)
  const [branchName, setBranchName] = useState('')
  const [isEditBranchName, setisEditBranchName] = useState(false)
  const [municipality, setMunicipality] = useState('')
  const [isEditMunicipality, setisEditMunicipality] = useState(false)
  const [province, setProvince] = useState('')
  const [isEditProvince, setisEditProvince] = useState(false)
  const [openingDate, setOpeningDate] = useState('')
  const [isEditOpeningDate, setisEditOpeningDate] = useState(false)
  const [dateAdded, setDateAdded] = useState('')
  const [supervisor, setSupervisor] = useState({})
  const [isEditSupervisor, setisEditSupervisor] = useState(false)
  const [employees, setEmployees] = useState([{}])
  const [isEditEmployees, setIsEditEmployees] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editLoading, setEditLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [supervisorList, setSupervisorList] = useState([{}])

  //new info for update branch
  const [newBarangay, setNewBarangay] = useState('')
  const [newBranchName, setNewBranchName] = useState('')
  const [newMunicipality, setNewMunicipality] = useState('')
  const [newProvince, setNewProvince] = useState('')
  const [newOpeningDate, setNewOpeningDate] = useState('')
  const [newSupervisor, setNewSupervisor] = useState('')
  const [newEmployee, setNewEmployee] = useState('')

  const BranchURL = process.env.REACT_APP_BRANCHES_URL + '/' + id + '/' + '_id/ioioo';
  const EmployeeURL = process.env.REACT_APP_EMPLOYEES_URL
  const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    console.log(BranchURL)
    axios.get(BranchURL)
      .then((res) => {
        const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.branch, secretKey).toString(CryptoJS.enc.Utf8));
        setBarangay(decryptedData.barangay)
        setBranchName(decryptedData.branch_name)
        setMunicipality(decryptedData.municipality)
        setProvince(decryptedData.province)
        setOpeningDate(decryptedData.opening_date)
        setDateAdded(decryptedData.date_added)
        setSupervisor(decryptedData.supervisor)
        setEmployees(decryptedData.employees)
        setBranchID(decryptedData._id)
        setLoading(false)
        axios.get(EmployeeURL)
          .then((res) => {
            const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.employees, secretKey).toString(CryptoJS.enc.Utf8));
            const filteredData = decryptedData.filter((item) => item.role === 'supervisor');
            setSupervisorList(filteredData)
          })
          .catch((error) => {
            console.error('Error getting supervisors: ', id)
          })
      })
      .catch((error) => {
        console.error('Error getting branch by id: ', id)
      })

  };

  function saveSupervisor(value, param, func, editFunc) {
    if (value === '') {
      setErrorMessage('Invalid input')
    } else {
      try {

        const foundSupervisor = supervisorList.find(item => item._id === value);

        if (foundSupervisor) {
          axios.get(process.env.REACT_APP_BRANCHES_URL)
            .then((res) => {

              //retrieves branches to check if supervisor is already assigned to a branch
              const data = decryptCollection(res.data.branches)
              const foundSupervisor = data.collection.find((item) =>
                item.supervisor && item.supervisor._id === value
              );

              if (foundSupervisor) {
                setErrorMessage('Supervisor already assigned to a branch')
              } else {
                try {
                  setEditLoading(true)
                  setErrorMessage(null)
                  const json = {
                    _id: branchID,
                    value: value,
                    attribute: param
                  }
                  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(json), secretKey).toString();

                  axios.post(process.env.REACT_APP_EDIT_BRANCHES_URL, { data: encryptedData })
                    .then((res) => {
                      console.log(res.status)
                      if (res.status !== 200) {
                        setErrorMessage(res.data.message)
                        setEditLoading(false)
                      } else {
                        editFunc(false)
                        func(value)
                        setEditLoading(false)
                        const isValueExist = supervisorList.find(item => item._id === value);
                        setSupervisor(isValueExist)
                      }
                    })
                    .catch((error) => {
                      console.error('Error updating branch info:', error)
                    })

                } catch (error) {
                  console.error('Error updating branch info: ', error)
                }

              }
            })
            .catch((error) => {
              console.error('Error getting branches:', error)
            })
        } else {
          setErrorMessage('Supervisor does not exist')
        }

      } catch (error) {
        console.error('Error updating supervisor in branch: ', error)
      }
    }
  }

  function saveBranch(value, param, func, editFunc) {
    if (value === '') {
      setErrorMessage('Invalid input')
    } else {
      try {
        setEditLoading(true)
        setErrorMessage(null)
        const json = {
          _id: branchID,
          value: value,
          attribute: param
        }
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(json), secretKey).toString();

        axios.post(process.env.REACT_APP_EDIT_BRANCHES_URL, { data: encryptedData })
          .then((res) => {
            console.log(res.status)
            if (res.status !== 200) {
              setErrorMessage(res.data.message)
              setEditLoading(false)
            } else {
              editFunc(false)
              func(value)
              setEditLoading(false)
            }
          })
          .catch((error) => {
            console.error('Error updating branch info:', error)
          })

      } catch (error) {
        console.error('Error updating branch info: ', error)
      }
    }
  }

  function saveEmployees(value, param, func, editFunc) {
    if (value === '') {
      setErrorMessage('Invalid input')
    } else {
      const employeeId = value
      axios.post(process.env.REACT_APP_EDIT_BRANCHES_URL + '/employee', { id: employeeId, branch_id: branchID })
        .then((res) => {
          if (res.data.status !== 200) {
            setErrorMessage(res.data.message)
          } else {
            const employee = res.data.employee
            const message = res.data.message
            editFunc(false)
            employees.push(employee)
          }
        })
        .catch((error) => {
          console.error('Error getting response from server for employee: ', error)
        })
    }
  }

  function handleEditChange(param, func, e) {
    e.preventDefault()

    if (func === 'cancel') setErrorMessage(null)

    switch (param) {
      case 'barangay':
        (func === 'edit') ? setisEditBarangay(true) : (func === 'save') ? saveBranch(newBarangay, 'barangay', setBarangay, setisEditBarangay) : setisEditBarangay(false);
        break;
      case 'municipality':
        (func === 'edit') ? setisEditMunicipality(true) : (func === 'save') ? saveBranch(newMunicipality, 'municipality', setMunicipality, setisEditMunicipality) : setisEditMunicipality(false);
        break;
      case 'branch_name':
        (func === 'edit') ? setisEditBranchName(true) : (func === 'save') ? saveBranch(newBranchName, 'branch_name', setBranchName, setisEditBranchName) : setisEditBranchName(false);
        break;
      case 'province':
        (func === 'edit') ? setisEditProvince(true) : (func === 'save') ? saveBranch(newProvince, 'province', setProvince, setisEditProvince) : setisEditProvince(false);
        break;
      case 'opening_date':
        (func === 'edit') ? setisEditOpeningDate(true) : (func === 'save') ? saveBranch(newOpeningDate, 'opening_date', setOpeningDate, setisEditOpeningDate) : setisEditOpeningDate(false);
        break;
      case 'supervisor':
        (func === 'edit') ? setisEditSupervisor(true) : (func === 'save') ? saveSupervisor(newSupervisor, 'supervisor', setSupervisor, setisEditSupervisor) : setisEditSupervisor(false);
        break;
      case 'employees':
        (func === 'edit') ? setIsEditEmployees(true) : (func === 'save') ? saveEmployees(newEmployee, 'employees', setEmployees, setIsEditEmployees) : setIsEditEmployees(false);
        break;
      default:
    }
  }

  function archiveBranch(id, e){
    e.preventDefault()
    try {
      const encryptedID = CryptoJS.AES.encrypt(id, secretKey).toString();
      axios.post(process.env.REACT_APP_ARCHIVE_BRANCH_URL,{_id: encryptedID})
      .then((res) => {
        if (res.status === 200) {
          toast.success('Archived Successfully')
          setTimeout(() => {
            window.location.reload();
          }, process.env.REACT_APP_RELOAD_TIME);
        } else {
          toast.error('Error archiving branch')
          setTimeout(() => {
            window.location.reload();
          }, process.env.REACT_APP_RELOAD_TIME);
        }
      })
    } catch (error) {
      console.error('Error archiving branch: ',error)
    }
  }

  return (
    <div>
      <MuiButton
        variant="contained"
        color="primary"
        onClick={handleShow}
      >
        Details
      </MuiButton>


      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName='modal-employee'
      >
        <Modal.Header closeButton>
          <Modal.Title>DETAILS</Modal.Title>
          <ToastContainer draggable={false} transition={Zoom} autoClose={7000} />
          {errorMessage && (
            <div class="alert alert-danger" role="alert" id="error-div">
              <center><b><p id="error-message">{errorMessage}</p></b></center>
            </div>
          )}
        </Modal.Header>
        <Modal.Body>
          {loading === true ? (
            <BounceLoader
              cssOverride={override}
              color="blue" />
          ) : (
            <div>
              <h3>Branch Information</h3>
              <table>
                <tbody>
                  <tr>
                    <td><b>Branch ID</b></td>
                    <td className='data-row'>{branchID}</td>
                  </tr>
                  <tr>
                    <td><b>Barangay</b></td>
                    <td className='data-row'>
                      {isEditBarangay === false ? (
                        <div className='data-row'>
                          <div>{barangay}</div>
                          <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('barangay', 'edit', e)} /></div>
                        </div>
                      ) : (
                        <div className='data-row'>
                          <div><input type="text" className='form-control edit-employee' placeholder='Barangay' onChange={(e) => setNewBarangay(e.target.value)} /></div>
                          {editLoading === false ? (
                            <div className='data-row edit-buttons'>
                              <div><UilX size='22' color='red' onClick={(e) => handleEditChange('barangay', 'cancel', e)} /></div>
                              <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('barangay', 'save', e)} /></div>
                            </div>
                          ) : (
                            <div>
                              <BarLoader width={'25px'} color='green' />
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><b>Municipality</b></td>
                    <td className='data-row'>
                      {isEditMunicipality === false ? (
                        <div className='data-row'>
                          <div>{municipality}</div>
                          <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('municipality', 'edit', e)} /></div>
                        </div>
                      ) : (
                        <div className='data-row'>
                          <div><input type="text" className='form-control edit-employee' placeholder='Municipality' onChange={(e) => setNewMunicipality(e.target.value)} /></div>
                          {editLoading === false ? (
                            <div className='data-row edit-buttons'>
                              <div><UilX size='22' color='red' onClick={(e) => handleEditChange('municipality', 'cancel', e)} /></div>
                              <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('municipality', 'save', e)} /></div>
                            </div>
                          ) : (
                            <div>
                              <BarLoader width={'25px'} color='green' />
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><b>Province</b></td>
                    <td className='data-row'>
                      {isEditProvince === false ? (
                        <div className='data-row'>
                          <div>{province}</div>
                          <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('province', 'edit', e)} /></div>
                        </div>
                      ) : (
                        <div className='data-row'>
                          <div><input type="text" className='form-control edit-employee' placeholder='Province' onChange={(e) => setNewProvince(e.target.value)} /></div>
                          {editLoading === false ? (
                            <div className='data-row edit-buttons'>
                              <div><UilX size='22' color='red' onClick={(e) => handleEditChange('province', 'cancel', e)} /></div>
                              <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('province', 'save', e)} /></div>
                            </div>
                          ) : (
                            <div>
                              <BarLoader width={'25px'} color='green' />
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><b>Branch Name</b></td>
                    <td className='data-row'>
                      {isEditBranchName === false ? (
                        <div className='data-row'>
                          <div>{branchName}</div>
                          <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('branch_name', 'edit', e)} /></div>
                        </div>
                      ) : (
                        <div className='data-row'>
                          <div><input type="text" className='form-control edit-employee' placeholder='Branch Name' onChange={(e) => setNewBranchName(e.target.value)} /></div>
                          {editLoading === false ? (
                            <div className='data-row edit-buttons'>
                              <div><UilX size='22' color='red' onClick={(e) => handleEditChange('branch_name', 'cancel', e)} /></div>
                              <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('branch_name', 'save', e)} /></div>
                            </div>
                          ) : (
                            <div>
                              <BarLoader width={'25px'} color='green' />
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><b>Opening Date</b></td>
                    <td className='data-row'>
                      {isEditOpeningDate === false ? (
                        <div className='data-row'>
                          <div>{formatDateToLetters(openingDate)}</div>
                          <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('opening_date', 'edit', e)} /></div>
                        </div>
                      ) : (
                        <div className='data-row'>
                          <div><input type="date" className='form-control edit-employee' onChange={(e) => setNewOpeningDate(e.target.value)} /></div>
                          {editLoading === false ? (
                            <div className='data-row edit-buttons'>
                              <div><UilX size='22' color='red' onClick={(e) => handleEditChange('opening_date', 'cancel', e)} /></div>
                              <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('opening_date', 'save', e)} /></div>
                            </div>
                          ) : (
                            <div>
                              <BarLoader width={'25px'} color='green' />
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><b>Date Added</b></td>
                    <td className='data-row'>
                      {dateAdded ? (
                        <div className='data-row'>
                          <div>{formatDateToLetters(dateAdded)}</div>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                </tbody>
              </table>

              <br></br>
              {supervisor === null ? (
                <div>
                  <center>No supervisor assigned</center>
                </div>
              ) : (
                <div>
                  <h3>Supervisor Information</h3>
                  <div class="table-container supervisor-section">
                    <div class="table-column">
                      <table class="supervisor-table">
                        <tbody>
                          <tr>
                            <td><b>ID</b></td>
                            <td className='data-row'>
                              {isEditSupervisor === false ? (
                                <div className='data-row'>
                                  <div>{supervisor._id}</div>
                                  <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('supervisor', 'edit', e)} /></div>
                                </div>
                              ) : (
                                <div className='data-row'>
                                  <div><input type="number" className='form-control edit-employee' onChange={(e) => setNewSupervisor(e.target.value)} placeholder='Supervisor ID' /></div>
                                  {editLoading === false ? (
                                    <div className='data-row edit-buttons'>
                                      <div><UilX size='22' color='red' onClick={(e) => handleEditChange('supervisor', 'cancel', e)} /></div>
                                      <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('supervisor', 'save', e)} /></div>
                                    </div>
                                  ) : (
                                    <div>
                                      <BarLoader width={'25px'} color='green' />
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Date Added</b></td>
                            <td className='data-row'>
                              {dateAdded ? (
                                <div className='data-row'>
                                  <div>{formatDateToLetters(dateAdded)}</div>
                                </div>
                              ) : null}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Username</b></td>
                            <td>
                              {supervisor.username}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Role</b></td>
                            <td>
                              {supervisor.role}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Email Address</b></td>
                            <td>
                              {supervisor.email_address}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Name</b></td>
                            <td>
                              {supervisor.first_name} {supervisor.middle_name} {supervisor.last_name}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table class="supervisor-table">
                        <tbody>
                          <tr>
                            <td><b>Contact Number</b></td>
                            <td>
                              {supervisor.contact_number}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Postal Code</b></td>
                            <td>
                              {supervisor.postal_code}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Address</b></td>
                            <td>
                              {supervisor.barangay}, {supervisor.municipality}, {supervisor.province}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Valid ID</b></td>
                            <td>
                              {supervisor.valid_id}
                            </td>
                          </tr>
                          <tr>
                            <td><b>Birth Certificate</b></td>
                            <td>
                              {supervisor.birth_certificate}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}


              <div>
                <hr></hr>
                <div className='employee-branch-title'>
                  <div><h3>Employees</h3></div>
                  {isEditEmployees === false ? (
                    <div className='add-employee-branch-details'><UilPlus size='24' onClick={(e) => handleEditChange('employees', 'edit', e)} />
                    </div>
                  ) : (
                    <div className='data-row'>
                      <div><input type="number" className='form-control edit-employee' onChange={(e) => setNewEmployee(e.target.value)} placeholder='Supervisor ID' /></div>
                      {editLoading === false ? (
                        <div className='data-row edit-buttons'>
                          <div><UilX size='22' color='red' onClick={(e) => handleEditChange('employees', 'cancel', e)} /></div>
                          <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('employees', 'save', e)} /></div>
                        </div>
                      ) : (
                        <div>
                          <BarLoader width={'25px'} color='green' />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {employees.length !== 0 ? (
                  <div>
                    <table className="employees-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Address</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee, index) => (
                          <tr key={index}>
                            <td>{employee.first_name} {employee.middle_name} {employee.last_name}</td>
                            <td>{employee.postal_code} {employee.barangay} {employee.municipality} {employee.province}</td>
                            <td>{employee.role}</td>
                            <td><DeleteEmployeeModal id={employee._id} branchID={branchID} setEmployees={setEmployees} setErrorMessage={setErrorMessage}/></td>
                          </tr>
                        ))}

                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <center>No employees to display</center>
                  </div>
                )}
    
              </div>
              <div className="row">
                <div className="col-sm-12" style={{ marginLeft: '750px', marginTop: '20px' }}>
                  <MuiButton
                    variant="contained"
                    color="error"
                    className='btn-edit'
                    onClick={(e) => archiveBranch(branchID, e)}
                  >Archive Branch
                  </MuiButton>
                </div>
          </div>
            </div>
            
          )}
          

        </Modal.Body>
      </Modal>
    </div>
  )
}

export default BranchDetails;