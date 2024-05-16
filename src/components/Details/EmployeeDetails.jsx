import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MuiButton from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { formatDateToLetters } from '../../functions/FormatDate';
import { pdfValidation, imageValidation } from '../../functions/FileValidation';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './EmployeeDetails.css';
import BounceLoader from 'react-spinners/HashLoader'
import BarLoader from 'react-spinners/BarLoader';
import { UilPen, UilCheck, UilX } from "@iconscout/react-unicons";
import { positionData } from '../../Data/Data';
import { ToastContainer, toast, Zoom } from 'react-toastify';

function EmployeeDetails({ id }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [editLoading, setEditLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  //Original Data
  const [employeeID, setEmployeeID] = useState('')
  const [isEditEmployeeID, setIsEditEmployeeID] = useState(false)
  const [employeeFirstName, setFirstName] = useState('')
  const [isEditFirstName, setIsEditFirstName] = useState(false)
  const [employeeMiddleName, setMiddleName] = useState('')
  const [isEditMiddleName, setIsEditMiddleName] = useState(false)
  const [employeeLastName, setLastName] = useState('')
  const [isEditLastName, setisEditLastName] = useState(false)
  const [gender, setGender] = useState('')
  const [isEditGender, setisEditGender] = useState(false)
  const [citizenship, setCitizenship] = useState('')
  const [isEditCitizenship, setisEditCitizenship] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [isEditEmailAddress, setisEditEmailAddress] = useState(false)
  const [contactNumber, setContactNumber] = useState('')
  const [isEditContactNumber, setisEditContactNumber] = useState(false)
  const [postalCode, setPostalCode] = useState('')
  const [isEditPostalCode, setisEditPostalCode] = useState(false)
  const [birthdate, setBirthDate] = useState('')
  const [isEditBirthDate, setisEditBirthDate] = useState(false)
  const [barangay, setBarangay] = useState('')
  const [isEditBarangay, setisEditBarangay] = useState(false)
  const [municipality, setMunicipality] = useState('')
  const [isEditMunicipality, setisEditMunicipality] = useState(false)
  const [province, setProvince] = useState('')
  const [isEditProvince, setisEditProvince] = useState(false)
  const [position, setPosition] = useState(null)
  const [isEditPosition, setisEditPosition] = useState(false)
  const [validID, setValidID] = useState(null)
  const [isEditValidID, setisEditValidID] = useState(false)
  const [birthCertificate, setBirthCertificate] = useState(null)
  const [isEditBirthCertificate, setisEditBirthCertificate] = useState(false)

  //New Typed Data (for Update)
  const [newEmployeeID, setnewEmployeeID] = useState('')
  const [newFirstName, setNewFirstName] = useState('')
  const [newEmployeeMiddleName, setNewMiddleName] = useState('')
  const [newEmployeeLastName, setNewLastName] = useState('')
  const [newGender, setNewGender] = useState('')
  const [newCitizenship, setNewCitizenship] = useState('')
  const [newEmailAddress, setNewEmailAddress] = useState('')
  const [newContactNumber, setNewContactNumber] = useState('')
  const [newPostalCode, setNewPostalCode] = useState('')
  const [newBirthdate, setNewBirthDate] = useState('')
  const [newBarangay, setNewBarangay] = useState('')
  const [newMunicipality, setNewMunicipality] = useState('')
  const [newProvince, setNewProvince] = useState('')
  const [newPosition, setNewPosition] = useState(null)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newValidID, setNewValidID] = useState(null)
  const [newBirthCertificate, setNewBirthCertificate] = useState(null)

  const EmployeeURL = process.env.REACT_APP_EMPLOYEES_URL + '/' + id;
  const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const options = positionData.map((position) => (
    <option key={position.id} value={position.value}>
      {position.name}
    </option>
  ));

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    axios.get(EmployeeURL)
      .then((res) => {
        const decryptedData = JSON.parse(CryptoJS.AES.decrypt(res.data.employee, secretKey).toString(CryptoJS.enc.Utf8));
        setEmployeeID(decryptedData[0]._id)
        setFirstName(decryptedData[0].first_name)
        setMiddleName(decryptedData[0].middle_name)
        setLastName(decryptedData[0].last_name)
        setGender(decryptedData[0].gender)
        setCitizenship(decryptedData[0].citizenship)
        setEmailAddress(decryptedData[0].email_address)
        setContactNumber(decryptedData[0].contact_number)
        setPostalCode(decryptedData[0].postal_code)
        setBirthDate(decryptedData[0].birth_date)
        setBarangay(decryptedData[0].barangay)
        setMunicipality(decryptedData[0].municipality)
        setProvince(decryptedData[0].province)
        setPosition(decryptedData[0].role)
        setValidID(decryptedData[0].valid_id)
        setBirthCertificate(decryptedData[0].birth_certificate)
        setLoading(false)
      })
      .catch((error) => {
        console.error(`Error retrieving employee ${id}`, error)
      })
  };

  function saveNewFiles(value, param, func, editFunc, oldValue) {
    if (value === null) {
      setErrorMessage('Incomplete form')
    } else {
      setEditLoading(true)
      const formData = new FormData()
      formData.append('file', value)
      formData.append('attribute', CryptoJS.AES.encrypt(param, secretKey).toString())
      formData.append('_id', CryptoJS.AES.encrypt(employeeID, secretKey).toString())
      formData.append('old_value', CryptoJS.AES.encrypt(oldValue, secretKey).toString())

      axios.post(process.env.REACT_APP_EDIT_EMPLOYEES_URL + '/files', formData)
        .then((res) => {
          if (res.status === 200) {
            editFunc(false)
            func(res.data.path)
            setEditLoading(false)
          } else {
            setErrorMessage(res.data.message)
          }
        })
        .catch((error) => { console.error('Error sending files to update: ', error) })
    }
  }

  function saveEmployee(value, param, func, editFunc) {

    if(param === 'contact_number' && value.length < 11){
      setErrorMessage("The number must be 11 or it should not be less than 11 numbers");
      setLoading(false)
    }else{
      if (param === 'role' && value === 'cashier' || param === 'role' && value === 'supervisor') {
      if (newUsername === '' || newPassword === '') {
        setErrorMessage('input credentials')
        return
      }
    }
    if (value === '') {
      setErrorMessage('Invalid input')
    } else {
      try {
        setEditLoading(true)
        setErrorMessage(null)
        const json = {
          _id: employeeID,
          value: value,
          attribute: param,
          username: newUsername,
          password: newPassword,
          email: emailAddress,
          role: position
        }
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(json), secretKey).toString();

        axios.post(process.env.REACT_APP_EDIT_EMPLOYEES_URL, { data: encryptedData })
          .then((res) => {
            if (res.data.status !== 200) {
              if (res.data.message === 'Email already in use') {
                setErrorMessage(res.data.message)
                setEditLoading(false)
              } else {
                editFunc(false)
                func(value)
                setEditLoading(false)
              }
            } else {
              setErrorMessage(res.data.message)
            }
          })
          .catch((error) => { console.error('Error updating employee: ', error) })

      } catch (error) {
        console.error('Something went wrong while sending update data: ', error)
      }
    }
    }

    
  }

  function handleEditChange(param, func, e) {
    e.preventDefault()

    if (func === 'cancel') setErrorMessage(null)

    switch (param) {
      case 'first_name':
        (func === 'edit') ? setIsEditFirstName(true) : (func === 'save') ? saveEmployee(newFirstName, 'first_name', setFirstName, setIsEditFirstName) : setIsEditFirstName(false);
        break;
      case 'middle_name':
        (func === 'edit') ? setIsEditMiddleName(true) : (func === 'save') ? saveEmployee(newEmployeeMiddleName, 'middle_name', setMiddleName, setIsEditMiddleName) : setIsEditMiddleName(false);
        break;
      case 'last_name':
        (func === 'edit') ? setisEditLastName(true) : (func === 'save') ? saveEmployee(newEmployeeLastName, 'last_name', setLastName, setisEditLastName) : setisEditLastName(false);
        break;
      case 'gender':
        (func === 'edit') ? setisEditGender(true) : (func === 'save') ? saveEmployee(newGender, 'gender', setGender, setisEditGender) : setisEditGender(false);
        break;
      case 'citizenship':
        (func === 'edit') ? setisEditCitizenship(true) : (func === 'save') ? saveEmployee(newCitizenship, 'citizenship', setCitizenship, setisEditCitizenship) : setisEditCitizenship(false);
        break;
      case 'email_address':
        (func === 'edit') ? setisEditEmailAddress(true) : (func === 'save') ? saveEmployee(newEmailAddress, 'email_address', setEmailAddress, setisEditEmailAddress) : setisEditEmailAddress(false);
        break;
      case 'contact_number':
        (func === 'edit') ? setisEditContactNumber(true) : (func === 'save') ? saveEmployee(newContactNumber, 'contact_number', setContactNumber, setisEditContactNumber) : setisEditContactNumber(false);
        break;
      case 'postal_code':
        (func === 'edit') ? setisEditPostalCode(true) : (func === 'save') ? saveEmployee(newPostalCode, 'postal_code', setPostalCode, setisEditPostalCode) : setisEditPostalCode(false);
        break;
      case 'birth_date':
        (func === 'edit') ? setisEditBirthDate(true) : (func === 'save') ? saveEmployee(newBirthdate, 'birth_date', setBirthDate, setisEditBirthDate) : setisEditBirthDate(false);
        break;
      case 'barangay':
        (func === 'edit') ? setisEditBarangay(true) : (func === 'save') ? saveEmployee(newBarangay, 'barangay', setBarangay, setisEditBarangay) : setisEditBarangay(false);
        break;
      case 'municipality':
        (func === 'edit') ? setisEditMunicipality(true) : (func === 'save') ? saveEmployee(newMunicipality, 'municipality', setMunicipality, setisEditMunicipality) : setisEditMunicipality(false);
        break;
      case 'province':
        (func === 'edit') ? setisEditProvince(true) : (func === 'save') ? saveEmployee(newProvince, 'province', setProvince, setisEditProvince) : setisEditProvince(false);
        break;
      case 'position':
        (func === 'edit') ? setisEditPosition(true) : (func === 'save') ? saveEmployee(newPosition, 'role', setPosition, setisEditPosition) : setisEditPosition(false);
        break;
      case 'valid_id':
        (func === 'edit') ? setisEditValidID(true) : (func === 'save') ? saveNewFiles(newValidID, 'valid_id', setValidID, setisEditValidID, validID) : setisEditValidID(false);
        break;
      case 'birth_certificate':
        (func === 'edit') ? setisEditBirthCertificate(true) : (func === 'save') ? saveNewFiles(newBirthCertificate, 'birth_certificate', setBirthCertificate, setisEditBirthCertificate, birthCertificate) : setisEditBirthCertificate(false);
        break;
      default:
    }
  }

  function archiveEmployee(id, e) {
    e.preventDefault()
    try {
      const encryptedID = CryptoJS.AES.encrypt(id, secretKey).toString();
      axios.post(process.env.REACT_APP_ARCHIVE_EMPLOYEE_URL,{id:encryptedID})
      .then((res) => {
        if (res.status === 200) {
          toast.success('Archived Successfully')
          setTimeout(() => {
            window.location.reload();
          }, process.env.REACT_APP_RELOAD_TIME);
        } else {
          toast.error('Error archiving employee')
          setTimeout(() => {
            window.location.reload();
          }, process.env.REACT_APP_RELOAD_TIME);
        }
      })
    } catch (error) {
      console.error('Error archiving employee')
      toast.error('Error archiving employee')
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
              <div className="tables-container">
                <div className="table">
                  <table>
                    <tbody>
                      <tr>
                        <td><b>Employee ID</b></td>
                        <td className='data-row'>

                          <div className='data-row'>
                            <div className='employee-id'>{employeeID}</div>
                            <div className='icons'>
                            </div>
                          </div>

                        </td>
                      </tr>
                      <tr>
                        <td><b>First Name</b></td>
                        <td className='data-row'>
                          {isEditFirstName === false ? (
                            <div className='data-row'>
                              <div>{employeeFirstName}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('first_name', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="text" onChange={(e) => setNewFirstName(e.target.value)} className='form-control edit-employee' placeholder='First Name' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('first_name', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('first_name', 'save', e)} /></div>
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
                        <td><b>Middle Name</b></td>
                        <td className='data-row'>
                          {isEditMiddleName === false ? (
                            <div className='data-row'>
                              <div>{employeeMiddleName}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('middle_name', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="text" onChange={(e) => setNewMiddleName(e.target.value)} className='form-control edit-employee' placeholder='Middle Name' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('middle_name', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('middle_name', 'save', e)} /></div>
                                </div>
                              ) : (
                                <div>
                                  <BarLoader width={'25px'} color='green' />
                                </div>
                              )
                              }
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td><b>Last Name</b></td>
                        <td className='data-row'>
                          {isEditLastName === false ? (
                            <div className='data-row'>
                              <div>{employeeLastName}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('last_name', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="text" onChange={(e) => setNewLastName(e.target.value)} className='form-control edit-employee' placeholder='Last Name' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('last_name', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('last_name', 'save', e)} /></div>
                                </div>
                              ) : (
                                <div>
                                  <BarLoader width={'25px'} color='green' />
                                </div>
                              )
                              }
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td><b>Gender</b></td>
                        <td className='data-row'>
                          {isEditGender === false ? (
                            <div className='data-row'>
                              <div>{gender}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('gender', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <select name="gender" onChange={(e) => setNewGender(e.target.value)} className='form-control edit-employee'>
                                <option value="" disabled selected>--select--</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('gender', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('gender', 'save', e)} /></div>
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
                        <td><b>Citizenship</b></td>
                        <td className='data-row'>
                          {isEditCitizenship === false ? (
                            <div className='data-row'>
                              <div>{citizenship}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('citizenship', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="text" onChange={(e) => setNewCitizenship(e.target.value)} className='form-control edit-employee' placeholder='Citizenship' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('citizenship', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('citizenship', 'save', e)} /></div>
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
                        <td><b>Email Address</b></td>
                        <td className='data-row'>
                          {isEditEmailAddress === false ? (
                            <div className='data-row'>
                              <div>{emailAddress}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('email_address', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="email" onChange={(e) => setNewEmailAddress(e.target.value)} className='form-control edit-employee' placeholder='Email Address' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('email_address', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('email_address', 'save', e)} /></div>
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
                        <td><b>Contact Number</b></td>
                        <td className='data-row'>
                          {isEditContactNumber === false ? (
                            <div className='data-row'>
                              <div>0{contactNumber}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('contact_number', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="number" onChange={(e) => setNewContactNumber(e.target.value)} className='form-control edit-employee' placeholder='Contact Number' maxLength={11}/></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('contact_number', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('contact_number', 'save', e)} /></div>
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
                    </tbody>
                  </table>
                </div>
                <div className="table">
                  <table>
                    <tbody>
                      <tr>
                        <td><b>Birth Date</b></td>
                        <td className='data-row'>
                          {isEditBirthDate === false ? (
                            <div className='data-row'>
                              <div>{formatDateToLetters(birthdate)}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('birth_date', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="date" onChange={(e) => setNewBirthDate(e.target.value)} className='form-control edit-employee' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('birth_date', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('birth_date', 'save', e)} /></div>
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
                        <td><b>Postal Code</b></td>
                        <td className='data-row'>
                          {isEditPostalCode === false ? (
                            <div className='data-row'>
                              <div>{postalCode}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('postal_code', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="number" onChange={(e) => setNewPostalCode(e.target.value)} className='form-control edit-employee' placeholder='Postal Code' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('postal_code', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('postal_code', 'save', e)} /></div>
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
                        <td><b>Barangay</b></td>
                        <td className='data-row'>
                          {isEditBarangay === false ? (
                            <div className='data-row'>
                              <div>{barangay}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('barangay', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="text" onChange={(e) => setNewBarangay(e.target.value)} className='form-control edit-employee' placeholder='Barangay' /></div>
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
                              <div><input type="text" onChange={(e) => setNewMunicipality(e.target.value)} className='form-control edit-employee' placeholder='Municipality' /></div>
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
                              <div><input type="text" onChange={(e) => setNewProvince(e.target.value)} className='form-control edit-employee' placeholder='Province' /></div>
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
                        <td><b>Position</b></td>
                        <td className='data-row'>
                          {isEditPosition === false ? (
                            <div className='data-row'>
                              <div>{position}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('position', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div>
                                <select name="position" className='form-control edit-employee' required onChange={(e) => setNewPosition(e.target.value)}>
                                  <option value="" disabled selected>--select--</option>
                                  {options}
                                </select>
                              </div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('position', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('position', 'save', e)} /></div>
                                </div>
                              ) : (
                                <div>
                                  <BarLoader width={'25px'} color='green' />
                                </div>
                              )}
                              {newPosition === 'supervisor' || newPosition === 'cashier' ? (
                                <div className="div5">
                                  <div className="loginCredentialDiv">
                                    <div className="usernameDiv">
                                      <label htmlFor="username"></label>
                                      <input type="text" name="username" className='form-control edit-employee' placeholder='Username' onChange={(e) => setNewUsername(e.target.value)} required />
                                    </div>
                                    <div className="passwordDiv">
                                      <label htmlFor="password"></label>
                                      <input type="password" name="password" className='form-control edit-employee' placeholder='Password' onChange={(e) => setNewPassword(e.target.value)} required />
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </td>
                      </tr>
                      {/* <tr>
                        <td><b>Valid ID</b></td>
                        <td className='data-row'>
                          {isEditValidID === false ? (
                            <div className='data-row'>
                              <div>{validID}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('valid_id', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="file" onChange={(e) => {
                                imageValidation(e.target.files[0], setErrorMessage)
                                setNewValidID(e.target.files[0])
                              }} className='form-control edit-employee' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('valid_id', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('valid_id', 'save', e)} /></div>
                                </div>
                              ) : (
                                <div>
                                  <BarLoader width={'25px'} color='green' />
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr> */}
                      {/* <tr>
                        <td><b>Birth Certificate</b></td>
                        <td className='data-row'>
                          {isEditBirthCertificate === false ? (
                            <div className='data-row'>
                              <div>{birthCertificate}</div>
                              <div className='icons'><UilPen size='18' onClick={(e) => handleEditChange('birth_certificate', 'edit', e)} /></div>
                            </div>
                          ) : (
                            <div className='data-row'>
                              <div><input type="file" onChange={(e) => {
                                pdfValidation(e.target.files[0], setErrorMessage)
                                setNewBirthCertificate(e.target.files[0])
                              }} className='form-control edit-employee' /></div>
                              {editLoading === false ? (
                                <div className='data-row edit-buttons'>
                                  <div><UilX size='22' color='red' onClick={(e) => handleEditChange('birth_certificate', 'cancel', e)} /></div>
                                  <div className=''><UilCheck size='24' color='green' onClick={(e) => handleEditChange('birth_certificate', 'save', e)} /></div>
                                </div>
                              ) : (
                                <div>
                                  <BarLoader width={'25px'} color='green' />
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12" style={{ marginTop: '5px' }}>
                  <MuiButton
                    variant="contained"
                    color="error"
                    className='btn-edit'
                    onClick={(e) => archiveEmployee(employeeID, e)}
                  >Archive Employee
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

export default EmployeeDetails;