import CryptoJS from 'crypto-js';

export function decryptUser(user){
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

    const user_info = {
        user:{
            _id: CryptoJS.AES.decrypt(user.user._id, secretKey).toString(CryptoJS.enc.Utf8),
            username: CryptoJS.AES.decrypt(user.user.username, secretKey).toString(CryptoJS.enc.Utf8),
            role: CryptoJS.AES.decrypt(user.user.role, secretKey).toString(CryptoJS.enc.Utf8),
            email_address: CryptoJS.AES.decrypt(user.user.email_address, secretKey).toString(CryptoJS.enc.Utf8),
            first_name: CryptoJS.AES.decrypt(user.user.first_name, secretKey).toString(CryptoJS.enc.Utf8),
            middle_name: CryptoJS.AES.decrypt(user.user.middle_name, secretKey).toString(CryptoJS.enc.Utf8),
            last_name: CryptoJS.AES.decrypt(user.user.last_name, secretKey).toString(CryptoJS.enc.Utf8),
            gender: CryptoJS.AES.decrypt(user.user.gender, secretKey).toString(CryptoJS.enc.Utf8),
            citizenship: CryptoJS.AES.decrypt(user.user.citizenship, secretKey).toString(CryptoJS.enc.Utf8),
            contact_number: CryptoJS.AES.decrypt(user.user.contact_number, secretKey).toString(CryptoJS.enc.Utf8),
            postal_code: CryptoJS.AES.decrypt(user.user.postal_code, secretKey).toString(CryptoJS.enc.Utf8),
            barangay: CryptoJS.AES.decrypt(user.user.barangay, secretKey).toString(CryptoJS.enc.Utf8),
            municipality: CryptoJS.AES.decrypt(user.user.municipality, secretKey).toString(CryptoJS.enc.Utf8),
            province: CryptoJS.AES.decrypt(user.user.province, secretKey).toString(CryptoJS.enc.Utf8),
            valid_id: CryptoJS.AES.decrypt(user.user.valid_id, secretKey).toString(CryptoJS.enc.Utf8),
            birth_certificate: CryptoJS.AES.decrypt(user.user.birth_certificate, secretKey).toString(CryptoJS.enc.Utf8)
        },
        access_token: user.access_token,
        refresh_token: user.refresh_token
    }

    return user_info;
}

export function decryptLocalStorageUser(user){
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;

    const user_info = {
        user:{
            _id: CryptoJS.AES.decrypt(user.user.user._id, secretKey).toString(CryptoJS.enc.Utf8),
            username: CryptoJS.AES.decrypt(user.user.user.username, secretKey).toString(CryptoJS.enc.Utf8),
            role: CryptoJS.AES.decrypt(user.user.user.role, secretKey).toString(CryptoJS.enc.Utf8),
            email_address: CryptoJS.AES.decrypt(user.user.user.email_address, secretKey).toString(CryptoJS.enc.Utf8),
            first_name: CryptoJS.AES.decrypt(user.user.user.first_name, secretKey).toString(CryptoJS.enc.Utf8),
            middle_name: CryptoJS.AES.decrypt(user.user.user.middle_name, secretKey).toString(CryptoJS.enc.Utf8),
            last_name: CryptoJS.AES.decrypt(user.user.user.last_name, secretKey).toString(CryptoJS.enc.Utf8),
            gender: CryptoJS.AES.decrypt(user.user.user.gender, secretKey).toString(CryptoJS.enc.Utf8),
            citizenship: CryptoJS.AES.decrypt(user.user.user.citizenship, secretKey).toString(CryptoJS.enc.Utf8),
            contact_number: CryptoJS.AES.decrypt(user.user.user.contact_number, secretKey).toString(CryptoJS.enc.Utf8),
            postal_code: CryptoJS.AES.decrypt(user.user.user.postal_code, secretKey).toString(CryptoJS.enc.Utf8),
            barangay: CryptoJS.AES.decrypt(user.user.user.barangay, secretKey).toString(CryptoJS.enc.Utf8),
            municipality: CryptoJS.AES.decrypt(user.user.user.municipality, secretKey).toString(CryptoJS.enc.Utf8),
            province: CryptoJS.AES.decrypt(user.user.user.province, secretKey).toString(CryptoJS.enc.Utf8),
            valid_id: CryptoJS.AES.decrypt(user.user.user.valid_id, secretKey).toString(CryptoJS.enc.Utf8),
            birth_certificate: CryptoJS.AES.decrypt(user.user.user.birth_certificate, secretKey).toString(CryptoJS.enc.Utf8),
            date_added: CryptoJS.AES.decrypt(user.user.user.date_added, secretKey).toString(CryptoJS.enc.Utf8),
            birth_date: CryptoJS.AES.decrypt(user.user.user.birth_date, secretKey).toString(CryptoJS.enc.Utf8),
        },
        access_token: user.user.access_token,
        refresh_token: user.user.refresh_token
    }

    return user_info;
}

export function decryptCollection(data){
    const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return {collection: decryptedData}
}