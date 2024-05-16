import React, { useState, useEffect } from "react";
import './Sidebar.css'
import MainDash from "../MainDash/MainDash";
import { SidebarData } from "../../Data/Data";
import {UilSignOutAlt,UilUserCircle} from '@iconscout/react-unicons'
import { refreshTokens, verifySidebar } from "../../functions/AuthUtils";
import verifyAccessToken from "../../functions/VerifyAccess";
import axios from "axios";
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import logoutUser from "../../functions/Logout";
import PullUpProfile from "./PullUpProfile";

const Sidebar = ({ data, user, access_token, refresh_token, selectedMenuItem, setUser}) => {

const [selected,setSelected] = useState(0)
const [openProfile,setOpenProfile] = useState(false)
const navigate = useNavigate();

const filteredSidebarData = SidebarData.filter(item =>
    user && user.role && item.roles.includes(user.role)
);

async function logout(e) {

    e.preventDefault();

    try {
        const verification = await verifyAccessToken(access_token);
        const message = verification.message
        console.log(message);
        const userWithTokens = {
            user: user,
            access_token: access_token,
            refresh_token: refresh_token
        }

        if(message=="Token invalid"){
        
            //verify access token if valid for refresh or not
            const refreshValidate = await refreshTokens(userWithTokens,process.env.REACT_APP_REFRESH_URL)
            //checks if tokens exist
            if(refreshValidate.access_token && refreshValidate.refresh_token){
                const res = await logoutUser(refreshValidate.access_token, refreshValidate.refresh_token, refreshValidate.user.username)
                console.log(res)
                if(res.message == "Logged out successfully"){
                    navigate('/', { state: { message: "logout" } });
                }else{
                    console.error("Logout was not successful")
                }

            }else{
                console.log("You are dili pwede here!")
                navigate('/403');
            }
           
        }else{
            //else statement (access token is still valid)
            const res = await logoutUser(access_token, refresh_token, user.username)
            console.log(res)
            if(res.message == "Logged out successfully"){
                navigate('/', { state: { message: "logout" } });
            }else{
                console.error("Logout was not successful")
            }
        }

    } catch (error) {
        console.error('Error verifying access token:', error);
    }
}

useEffect(() => {
    const selectedIndex = filteredSidebarData.findIndex(item => item.heading === selectedMenuItem);
    setSelected(selectedIndex >= 0 ? selectedIndex : 0);
}, [selectedMenuItem]);

    return(
        <div className="Sidebar">
            {/* logo */}
            <div className="logo">
                <img src="/images/logo.png" alt="" />
            </div>

            {/* menu */}
            <div className="menu">
            {filteredSidebarData.map((item, index) => {
                    
                    return (
                        <div
                        className={selected === index ? 'menuItem active' : 'menuItem'}
                        key={index}
                        onClick={() => verifySidebar(data,setUser)
                        .then((result) => {
                            if(result === false){
                                navigate('/403')
                            }else{
                                navigate(item.link)
                            }
                        })}
                        // onClick={() => {
                        //     navigate(item.link) // Update the selected menu item
                        // }}      
                        >
                            <item.icon />
                            <span>
                                {item.heading}
                            </span>
                        </div>
                    );
                })}

                {
                    openProfile &&  <PullUpProfile logout={logout}/>
                }
               

                <div className="menuItem profile">
                    <UilUserCircle onClick={()=> setOpenProfile((prev)=>!prev)}/>
                    {/* <UilSignOutAlt onClick={(e)=>logout(e)}/> */}
                </div>
            </div>
        </div>
    )
}

export default Sidebar