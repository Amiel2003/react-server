import { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Employees.css'
import { positionData } from '../../Data/Data';
import { verifySidebar } from '../../functions/AuthUtils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { imageValidation, pdfValidation } from '../../functions/FileValidation';
import CryptoJS from 'crypto-js';
import MuiButton from '@mui/material/Button';
import BarLoader from "react-spinners/BarLoader";
import {ToastContainer, toast, Zoom, Bounce} from 'react-toastify'
import { generateStrongPassword } from '../../functions/GenerateID';
import 'react-toastify/dist/ReactToastify.css'

function AddEmployee({user,setUser}) {
  const [show, setShow] = useState(false);
  const [employeeID,setEmployeeID] = useState('')
  const [employeeFirstName,setFirstName] = useState('')
  const [employeeMiddleName,setMiddleName] = useState('')
  const [employeeLastName,setLastName] = useState('')
  const [gender,setGender] = useState('')
  const [citizenship,setCitizenship] = useState('')
  const [emailAddress,setEmailAddress] = useState('')
  const [contactNumber,setContactNumber] = useState('')
  const [postalCode,setPostalCode] = useState('')
  const [birthdate,setBirthDate] = useState('')
  const [barangay,setBarangay] = useState('')
  const [municipality,setMunicipality] = useState('')
  const [province,setProvince] = useState('')
  const [position,setPosition] = useState(null)
  const [validID,setValidID] = useState(null)
  const [birthCertificate,setBirthCertificate] = useState(null)
  const [username,setUsername] = useState(null)
  const [password,setPassword] = useState(generateStrongPassword())
  const [errorMessage,setErrorMessage] = useState(null)
  const [serverResMessage,setServerResMessage] = useState(null)
  const [lackingError,setLackingError] = useState(null)
  const [successMessage,setSuccessMessage] = useState(null)
  const [loading,setLoading] = useState(false)
  const [disabled,setDisabled] = useState(false)

  const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
  const navigate = useNavigate();


  const handleContactNumberChange = (e) => {
    const input = e.target.value;

    // Remove any non-numeric characters
    const numericInput = input.replace(/\D/g, '');

    // Check if the input has more than 11 digits
    if (numericInput.length > 11) {
      // If more than 11 digits, take only the first 11 digits
      setContactNumber(numericInput.slice(0, 11));
    } else {
      // Otherwise, set the input value
      setContactNumber(numericInput);
    }
  };  



  
  

  const options = positionData.map((position) => (
    <option key={position.id} value={position.value}>
      {position.name}
    </option>
  ));


  

  function submit(e){
    e.preventDefault();
    setLackingError(null)
    setErrorMessage(null)
    setServerResMessage(null)
    setSuccessMessage(null)
      if(employeeID <= 0 || contactNumber <= 0 || postalCode <= 0){
        setErrorMessage("cannot accept zero and negative values");
        setLoading(false)
    }else{
      setLoading(true)
      if(!gender||!position||gender===''||position===''){
          if(!gender||gender===''){
            setLoading(false)
            setLackingError('Please input gender')
          }
          if(!position||position===''){
            setLoading(false)
            setLackingError('Please input position')
          }
      }else{
      const formData = new FormData()
      formData.append('_id', CryptoJS.AES.encrypt(employeeID, secretKey).toString())
      formData.append('first_name',CryptoJS.AES.encrypt(employeeFirstName, secretKey).toString())
      formData.append('middle_name',CryptoJS.AES.encrypt(employeeMiddleName, secretKey).toString())
      formData.append('last_name',CryptoJS.AES.encrypt(employeeLastName, secretKey).toString())
      formData.append('gender',CryptoJS.AES.encrypt(gender, secretKey).toString())
      formData.append('citizenship',CryptoJS.AES.encrypt(citizenship, secretKey).toString())
      formData.append('email_address',CryptoJS.AES.encrypt(emailAddress, secretKey).toString())
      formData.append('contact_number',CryptoJS.AES.encrypt(contactNumber, secretKey).toString())
      formData.append('postal_code',CryptoJS.AES.encrypt(postalCode, secretKey).toString())
      formData.append('birth_date',CryptoJS.AES.encrypt(birthdate, secretKey).toString())
      formData.append('barangay',CryptoJS.AES.encrypt(barangay, secretKey).toString())
      formData.append('municipality',CryptoJS.AES.encrypt(municipality, secretKey).toString())
      formData.append('province',CryptoJS.AES.encrypt(province, secretKey).toString())
      formData.append('position',CryptoJS.AES.encrypt(position, secretKey).toString())
      formData.append('user_role',CryptoJS.AES.encrypt(user.user.role, secretKey).toString())
      formData.append('user_id',CryptoJS.AES.encrypt(user.user._id, secretKey).toString())

      let hasWhitespace = false;

      for (const value of formData.values()) {
        const decrypt = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
        if (decrypt.trim() === '') {
          hasWhitespace = true;
          break;
        }
      }

      if (hasWhitespace) {
        setErrorMessage("Cannot accept empty strings");
      } else {
        if (password !== null && username !== null) {
          formData.append('username', CryptoJS.AES.encrypt(username, secretKey).toString());
          formData.append('password', CryptoJS.AES.encrypt(password, secretKey).toString());
          formData.append('refresh_tokens', []);
          connectToServer(formData)
        }else{
          connectToServer(formData)
        }
       }

      
      }
      
    }

 
  }

  function connectToServer(formData){

    const currentDate = new Date();
    const birth = new Date(birthdate)


    if (birth > currentDate) {
      // Alert the user if the birthdate is in the future
      setErrorMessage("Birthdate cannot be in the future");
      setLoading(false);
      return; // Exit the function to prevent further execution
  }else{
    if (contactNumber.length < 11) {
      // Alert the user if the contact number is less than eleven digits
      setErrorMessage("The number must be 11 or it should not be less than 11 numbers");
      setLoading(false);
    }else{
      const addEmployeeURL = process.env.REACT_APP_EMPLOYEES_URL
      axios.post(addEmployeeURL,formData)
        .then(res => {
          if(res.data.status !== 200){
            setLackingError(null)
            setErrorMessage(null)
            setSuccessMessage(null)
            setLoading(false)
            toast.error(res.data.message)
          }else{
            setLackingError(null)
            setErrorMessage(null)
            setServerResMessage(null)
            setLoading(false)
            toast.success(res.data.message)
            setDisabled(true)
  
            setTimeout(() => {
              window.location.reload();
            }, process.env.REACT_APP_RELOAD_TIME);
          }
        })
        .catch(er => console.log(er))
    }
  }

    

   
  }

  function validateSelect(value){
    if(value!==''||value!==null){
      setLackingError(null)
      setGender(value)
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setErrorMessage(null);
    setLackingError(null);
    setServerResMessage(null);
    setSuccessMessage(null);
    setPosition(null)
    setShow(true);
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
    width: '500px'
  };
  
  return (
    <>
    {/* <input type="button" className="btn btn-success" value={"+ Add Employee"} onClick={handleShow} /> */}
    <MuiButton
      variant="contained" 
      color="success" 
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
        + Add Employee
      </MuiButton>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName='modal-employee'
      >
        <Modal.Header closeButton>
          <Modal.Title>EMPLOYEE FORM</Modal.Title>
          <ToastContainer draggable={false} transition={Zoom} autoClose={7000} />
          {loading && (
            <BarLoader
            cssOverride={override}
            color="green"/>
          )}
         {errorMessage && (
                  <div class="alert alert-danger" role="alert" id="error-div">
                     <center><b><p id="error-message">{errorMessage}</p></b></center>
                 </div>
          )}
          {serverResMessage && (
                  <div class="alert alert-danger" role="alert" id="error-div">
                     <center><b><p id="error-message">{serverResMessage}</p></b></center>
                 </div>
          )}
          {lackingError && (
                  <div class="alert alert-danger" role="alert" id="error-div">
                     <center><b><p id="error-message">{lackingError}</p></b></center>
                 </div>
          )}
          {successMessage && (
                  <div class="alert alert-success" role="alert" id="error-div">
                     <center><b><p id="error-message">{successMessage}</p></b></center>
                 </div>
          )}
        </Modal.Header>
        <Modal.Body>
         <form onSubmit={(e)=>submit(e)} className='employeeForm'>
            <b><h5>Personal Information</h5></b>
            <div className="div1">
                <div className="employeeIDDiv">
                  <label htmlFor="employeeID">Employee ID</label>
                  <input type="number" name="employeeID" className='form-control' placeholder='Employee ID' required onChange={(e) => setEmployeeID(e.target.value)}/>
                </div>
                <div className="employeeFirstNameDiv">
                  <label htmlFor="employeeFirstName">First Name</label>
                  <input type="text" name="employeeFirstName" className='form-control' placeholder='First Name' required onChange={(e) => setFirstName(e.target.value)}/>
                </div>
                <div className="employeeMiddleNameDiv">
                  <label htmlFor="employeeMiddleName">Middle Name</label>
                  <input type="text" name="employeeMiddleName" className='form-control' placeholder='Middle Name' onChange={(e) => setMiddleName(e.target.value)}/>
                </div>
                <div className="employeeLastNameDiv">
                  <label htmlFor="employeeLastName">Last Name</label>
                  <input type="text" name="employeeLastName" className='form-control' placeholder='Last Name' required onChange={(e) => setLastName(e.target.value)}/>
                </div>
            </div>

            <div className="div2">
                <div className="genderDiv">
                  <label htmlFor="gender">Gender</label>
                  <select name="gender" className='form-control' required onChange={(e) => setGender(e.target.value)}>
                  <option value="" disabled selected>--select--</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="citizenshipDiv">
                  <label htmlFor="citizenship">Citizenship</label>
                  <input type="text" name="citizenship" className='form-control' placeholder='Citizenship' required onChange={(e) => setCitizenship(e.target.value)}/>
                </div>
                <div className="emailAddressDiv">
                  <label htmlFor="emailAddress">Email Address</label>
                  <input type="email" name="emailAddress" className='form-control' placeholder='Email Address' required onChange={(e) => setEmailAddress(e.target.value)}/>
                </div>
                <div className="contactNumberDiv">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
                type="text"
                name="contactNumber"
                className='form-control'
                placeholder='Contact Number'
                value={contactNumber}
                onChange={handleContactNumberChange}
                maxLength={11} // Limit input to 11 characters
                required
            />
        </div>
                <div className="postalCodeDiv">
                <label htmlFor="postalCode">Postal Code</label>
                <input type="number" name="postalCode" className='form-control' placeholder='Code' style={{width:'100px'}} required onChange={(e) => setPostalCode(e.target.value)}/>
              </div>
            </div>

            <div className="div3">
              <div className="birthDateDiv">
                <label htmlFor="birthdate">Birth Date</label>
                <input type="date" name="birthdate" className='form-control' required onChange={(e) => setBirthDate(e.target.value)}/>
              </div>
              <div className="barangayDiv">
                <label htmlFor="barangay">Barangay</label>
                <input type="text" name='barangay' className='form-control' placeholder='Barangay' required onChange={(e) => setBarangay(e.target.value)}/>
              </div>
              <div className="municipalityDiv">
                <label htmlFor="municipality">Municipality/City</label>
                <input type="text" name='municipality' className='form-control' placeholder='Municipality/City' required onChange={(e) => setMunicipality(e.target.value)}/>
              </div>
              <div className="provinceDiv">
                <label htmlFor="province">Province</label>
                <input type="text" name='province' className='form-control' placeholder='Province' required onChange={(e) => setProvince(e.target.value)}/>
              </div>
            </div>
            <br />
            <b><h5>Employment Information</h5></b>
            <div className="div4">
              {/* <div className="validIDdiv">
                <label htmlFor="validID">Valid ID</label>
                <input type="file" name='valid_id' className='form-control' required onChange={(e) => {
                                                                                      imageValidation(e.target.files[0], setErrorMessage);
                                                                                      setValidID(e.target.files[0]); 
                                                                                    }}/>
              </div>
              <div className="birthCertificate">
                <label htmlFor="birthCertificate">Birth Certificate</label>
                <input type="file" name='birth_certificate' className='form-control' required onChange={(e) => {
                                                                                          pdfValidation(e.target.files[0],setErrorMessage);
                                                                                          setBirthCertificate(e.target.files[0]);
                                                                                          }}/>
              </div> */}
              <div className="positionDiv">
                <label htmlFor="position">Position</label>
                  <select name="position" className='form-control' required onChange={(e) => setPosition(e.target.value)}>
                  <option value="" disabled selected>--select--</option>
                    {options}
                  </select>
              </div>
            </div>

            {position === 'supervisor' || position === 'cashier' ? (
                <div className="div5">
                  <b><h5>Login Credentials</h5></b>
                  <div className="loginCredentialDiv">
                    <div className="usernameDiv">
                      <label htmlFor="username">Username</label>
                      <input type="text" name="username" className='form-control' placeholder='Username' onChange={(e) => setUsername(e.target.value)} required/>
                    </div>
                    <div className="passwordDiv">
                      <label htmlFor="password">Password</label>
                      <input type="password" name="password" className='form-control' placeholder='Password' value={password} required disabled/>
                    </div>
                  </div>
                </div>
              ) : null}
            <div className="buttonsEmployee">
              <Button variant="secondary" onClick={handleClose}>Close</Button>
              <Button variant="primary" type='submit' disabled={disabled}>Save Employee</Button>
            </div>
         </form>
        </Modal.Body>
      </Modal>

    </>
  );
}

export default AddEmployee;