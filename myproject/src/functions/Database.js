import axios from 'axios';
import CryptoJS from 'crypto-js';

export async function retrieveEmployeeCollection(url){
    try {
        const response = await axios.get(url); // Use await to wait for the response
        const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
        const decrypt = CryptoJS.AES.decrypt(response.data.employees, secretKey).toString(CryptoJS.enc.Utf8);
        const decryptedData = JSON.parse(decrypt);

        return decryptedData; // Return the decrypted data

    } catch (error) {
        console.error('Error retrieving employees ',error)
    }
}