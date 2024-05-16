import verifyAccessToken from './VerifyAccess';
import axios from 'axios';
import CryptoJS from 'crypto-js';


export async function refreshTokens(user, refreshURL) {
    try {
        if (user && user.access_token && user.refresh_token) {
            const res = await axios.post(refreshURL, { user: user.user, token: user.refresh_token });
            console.log("access: "+res.data.access_token)
            console.log("refresh: "+res.data.refresh_token)
            const verification = await verifyAccessToken(res.data.access_token);
            console.log(verification);
            return {
                ...user,
                access_token: res.data.access_token,
                refresh_token: res.data.refresh_token
            };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function verifySidebar(user,setUser){
    const verification = await verifyAccessToken(user.access_token)
    console.log(verification)
    if(verification.message !== "You are authorized"){
        const refreshedUser = await refreshTokens(user,process.env.REACT_APP_REFRESH_URL)
        const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

        if(refreshedUser.access_token && refreshedUser.refresh_token){
            setUser(refreshedUser);
            const encryptedUser = {
                user: {
                    _id: CryptoJS.AES.encrypt(refreshedUser.user._id, secretKey).toString(),
                    username: CryptoJS.AES.encrypt(refreshedUser.user.username, secretKey).toString(),
                    role: CryptoJS.AES.encrypt(refreshedUser.user.role, secretKey).toString(),
                    email_address: CryptoJS.AES.encrypt(refreshedUser.user.email_address, secretKey).toString(),
                    first_name: CryptoJS.AES.encrypt(refreshedUser.user.first_name, secretKey).toString(),
                    middle_name: CryptoJS.AES.encrypt(refreshedUser.user.middle_name, secretKey).toString(),
                    last_name: CryptoJS.AES.encrypt(refreshedUser.user.last_name, secretKey).toString(),
                    gender: CryptoJS.AES.encrypt(refreshedUser.user.gender, secretKey).toString(),
                    citizenship: CryptoJS.AES.encrypt(refreshedUser.user.citizenship, secretKey).toString(),
                    contact_number: CryptoJS.AES.encrypt(refreshedUser.user.contact_number, secretKey).toString(),
                    postal_code: CryptoJS.AES.encrypt(refreshedUser.user.postal_code, secretKey).toString(),
                    barangay: CryptoJS.AES.encrypt(refreshedUser.user.barangay, secretKey).toString(),
                    municipality: CryptoJS.AES.encrypt(refreshedUser.user.municipality, secretKey).toString(),
                    province: CryptoJS.AES.encrypt(refreshedUser.user.province, secretKey).toString(),
                    valid_id: CryptoJS.AES.encrypt(refreshedUser.user.valid_id, secretKey).toString(),
                    birth_certificate: CryptoJS.AES.encrypt(refreshedUser.user.birth_certificate, secretKey).toString(),
                    date_added: CryptoJS.AES.encrypt(user.date_added, secretKey).toString(),
                    birth_date: CryptoJS.AES.encrypt(user.birth_date, secretKey).toString(),
                },
                access_token: refreshedUser.access_token,
                refresh_token: refreshedUser.refresh_token 
            }
            localStorage.setItem('user', JSON.stringify({ user: encryptedUser }));
            return true;
        }else{
            console.log("You are dili pwede here!")
            return false;
        }
    }else{
        return true;
    }
}

