import { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProfileView from './Profile/Profile'
import Sidebar from './Sidebar/Sidebar'

function Profile({user,setUser}){
    const [selectedMenuItem, setSelectedMenuItem] = useState("Employees");
    const [hiredDate,setHiredDate] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.user) {
            // User is not authenticated or user data is missing
            navigate('/');
        }
        setHiredDate(user.user.date_added)
    }, []);

    return(
        <div className="Profile">
            <input type="button" value={''} disabled className="form-control" style={{backgroundColor: 'rgb(147, 124, 91)'}}/>
            <ProfileView user={user} hiredDate={hiredDate}/>
        </div>
    )
}

export default Profile;