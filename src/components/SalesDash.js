import '../Dashboard.css';
import Sidebar from './Sidebar/Sidebar';
import MainDash from './MainDash/MainDash'
import RightSide from '../RightSide/RightSide';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';

function AboutUs({user,setUser}){
    const [selectedMenuItem, setSelectedMenuItem] = useState("Sales");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.user) {
            // User is not authenticated or user data is missing
            navigate('/');
        }
    }, []);
      
    return(
        <div className='Dashboard'>
        {user && user.user && (
            <>
                <Sidebar data={user} user={user.user} access_token={user.access_token} refresh_token={user.refresh_token} selectedMenuItem={selectedMenuItem} setUser={setUser}/>
                <MainDash data={user} user={user.user} setUser={setUser} selectedMenuItem={selectedMenuItem} />
                <RightSide />
            </>
        )}
        
    </div>
    )
}

export default AboutUs;