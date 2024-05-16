import { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import verifyAccessToken from '../functions/VerifyAccess'
import { useNavigate } from 'react-router-dom';
import { decryptUser } from '../functions/DecryptUser';

function Google({ updateErrorMessage, updateUser }) {
    const navigate = useNavigate();

    function handleCallbackResponse(response) {
        const userObject = jwt_decode(response.credential)
        const googleURL = process.env.REACT_APP_GOOGLE_URL;

        axios.post(googleURL, { email: userObject.email })
            .then(async (res) => {
                if (res.data.found === false) {
                    updateErrorMessage(res.data.message)
                } else {
                    const access_token = res.data.access_token
                    const response = await verifyAccessToken(access_token)
                    if (response.message === "You are authorized") {
                        const decryptedUser = await decryptUser(res.data)
                        console.log('incomplete', decryptedUser.user.role)

                        switch (decryptedUser.user.role) {
                            case 'admin':
                                updateUser(decryptedUser, res.data)
                                navigate('/dashboard');
                                break;
                            case 'supervisor':
                                updateUser(decryptedUser, res.data)
                                navigate('/dashboard');
                                break;
                            default:
                                updateErrorMessage('Unauthorized access')
                                break;
                        }
                    } else {
                        updateErrorMessage("Something went wrong")
                    }
                }
            })
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large", width: "380px" }
        )
    }, [])

    return (
        <div id="signInDiv"></div>
    )
}

export default Google;