import React from "react";
import {UilSignOutAlt,UilUserCircle} from '@iconscout/react-unicons'
import './Sidebar.css'
import { useNavigate } from 'react-router-dom';

const PullUpProfile = ({logout}) => {
    const navigate = useNavigate();

    async function redirectToProfile(){
        navigate('/profile')
    }

    return(
        <div className="flex flex-col pullUpProfile">
                <p><a onClick={redirectToProfile} style={{cursor:"pointer"}}><UilUserCircle/>     Profile</a></p>
                <p><a onClick={logout} style={{cursor:"pointer"}}><UilSignOutAlt/>     Logout</a></p>    
        </div>
    )
}

export default PullUpProfile