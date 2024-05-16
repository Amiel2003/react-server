import axios from "axios";
import CryptoJS from "crypto-js";

export const returnEmployeeToActive = (row) => {
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

    const encryptedID = CryptoJS.AES.encrypt(row._id, secretKey).toString();

    // Your specific function logic here, you can access row data if 
    axios.post(process.env.REACT_APP_UNARCHIVE_EMPLOYEE_URL,{_id: encryptedID})
    .then((res) => {
        setTimeout(() => {
              window.location.reload();
            }, process.env.REACT_APP_RELOAD_TIME);
    })
    .catch((error) => {
        console.error('Error activating employee: ',error)
    })
  };


  export const returnBranchToActive = (row) => {
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

    const encryptedID = CryptoJS.AES.encrypt(row._id, secretKey).toString();

    // Your specific function logic here, you can access row data if 
    axios.post(process.env.REACT_APP_UNARCHIVE_BRANCH_URL,{_id: encryptedID})
    .then((res) => {
        setTimeout(() => {
              window.location.reload();
            }, process.env.REACT_APP_RELOAD_TIME);
    })
    .catch((error) => {
        console.error('Error activating employee: ',error)
    })
  };