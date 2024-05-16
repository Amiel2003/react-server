import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import ReCAPTCHA from "react-google-recaptcha";
import jwt_decode from 'jwt-decode';
import verifyAccessToken from '../functions/VerifyAccess'
import Google from './Google'
import { useNavigate } from 'react-router-dom';
import { refreshTokens } from '../functions/AuthUtils';
import { useLocation } from 'react-router-dom';
import { decryptUser } from '../functions/DecryptUser';
import {ToastContainer, toast, Zoom, Bounce} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Login({user,setUser}) {
    const loginURL = process.env.REACT_APP_LOGIN_URL;
    const refreshURL = process.env.REACT_APP_REFRESH_URL;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { message } = location.state || {};

    //for logout
    useEffect(() => {
        if(message){
            setUser(null);
            // Clear user data from local storage
            localStorage.removeItem('user');
        }
        if(user){
            navigate('/dashboard')
        }
    }, []); 

    function submit(e) {
        // DATA ENCRYPTION
        const secretKey = process.env.REACT_APP_CRYPTOJS_SECRET_KEY;
        const encryptedUsername = CryptoJS.AES.encrypt(username, secretKey).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

        setIsLoading(true);

        e.preventDefault();

        axios.post(loginURL, {
            username: encryptedUsername,
            password: encryptedPassword,
            // recaptchaResponse: recaptchaValue
        })
        .then(async (res) => {

            //handle server response
            const loadingSpan = document.getElementById('loading');
            loadingSpan.className = 'bi bi-check-lg bi-3x';
            
            setErrorMessage('');
            verifyAccessToken(res.data.access_token)

            const decryptedUser = await decryptUser(res.data)
            console.log('meerrro',decryptedUser)
            setUser(decryptedUser);
            localStorage.setItem('user', JSON.stringify({ user: res.data }));
            // Redirect to the dashboard
            navigate('/dashboard');
        })
        .catch((error) => {
            // Handle error
            if (error.response && error.response.data.message) {
                setIsLoading(false);
                // If the server responded with an error message
                setErrorMessage(error.response.data.message);
                toast.error(error.response.data.message)
            } else {
                // If there was an error without a server response
                setIsLoading(false);
                toast.error('An error occurred. Please try again later.');
            }
        });
    }

    function updateErrorMessage(newErrorMessage) {
        setErrorMessage(newErrorMessage);
        toast.error(newErrorMessage)
      }
    
    function updateUser(user,encryptedUser) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify({ user: encryptedUser }));
    }

    //   function check(e) {
    //     e.preventDefault();
    //     const decodedAccessToken = jwt_decode(user.access_token);
    //     if (decodedAccessToken.exp * 1000 <= Date.now()) {
    //         console.log("EXPIRED, GETTING NEW ONE");
    //         refreshTokens(user, refreshURL)
    //             .then(updatedUser => {
    //                 if (updatedUser) {
    //                     setUser(updatedUser); // Update the user state
    //                 }
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     } else {
    //         console.log("VALID");
    //     }
    // }

    // function check(e){
    //     e.preventDefault()
    //     axios.get('http://localhost:5000/check')
    //     .then(async (res) => {
    //         console.log(res.data)
    //     })
    // }
    

    return(        
        <div class="holder">
        <div id="section1" class="inner-section">
            <img id="title-image" alt=""/>
            <div id="credentials">
            {/* <button onClick={(e)=>check(e)} type="button" class="btn" id="submit" ></button> */}
                <form onSubmit={(e)=>submit(e)} action="/submit" method="POST" id="login-form">
                    <div id="login-message-div">
                        <p><b id="login-text">LOGIN</b></p>

                            {errorMessage && (
                                <ToastContainer draggable={false} transition={Zoom} autoClose={7000}/>
                            )}
                            
                    </div>

                    <div id="username-section">
                        <input onChange={(e) => setUsername(e.target.value)} type="text" autoComplete='off'  
                        class="form-control" name="username" placeholder="Username" id="username" required/>
                    </div>
                    <div id="password-section">
                        <input onChange={(e) => setPassword(e.target.value)} type="password" class="form-control" name="password" placeholder="Password" id="password" required/>
                    </div>
                    <button type="submit" class="btn" id="submit" >
                    {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" id='loading'></span>
                        ) : (
                            'LOGIN'
                        )}
                    </button>
                    {/* <ReCAPTCHA id="recaptcha"
                    sitekey="6Ldm0SsoAAAAAMis7Af4GwgPNm_6LfDLswbo0uKy"
                    onChange={(value) => setRecaptchaValue(value)}
                    /> */}
                </form>
                <div id="google">
                    <p id="continue-with">______________________________</p>
                    <Google updateErrorMessage={updateErrorMessage} updateUser={updateUser}></Google>
                </div>
                <div id="short-info">
                    <p id="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed tempora consequatur reiciendis quas 
                        facere facilis eveniet fugiat porro voluptas odit officia vitae, autem repellendus nemo, ea accusantium excepturi, 
                        aspernatur nam!</p>
                </div>
            </div>
        </div>
        <div id="image-section" class="inner-section">
            <img id="image" alt=""/>
        </div>
    </div>
    )
}

export default Login;