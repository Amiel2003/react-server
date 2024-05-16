import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

async function AuthLogin({user}){
    
}
const AuthLogin = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { state: { user } });
    }else{
        return <Login/>
    }
  }, [user, navigate]);

  return null; // This component doesn't render anything
};

export default AuthLogin;
