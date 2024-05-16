import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BranchesDash from './components/BranchesDash';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Unauthorized from './components/Unauthorized';
import EmployeesDash from './components/EmployeesDash';
import ProductsDash from './components/ProductsDash'
import InventoryDash from './components/InventoryDash'
import { useState,useEffect } from 'react';
import { decryptUser, decryptLocalStorageUser } from './functions/DecryptUser';
import AboutUs from './components/AboutUs';
import Profile from './components/Profile';
import NotFound from './components/NotFound'
import Sales from './components/SalesDash'
import OrangePi from './components/OrangePi';

function App() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const decryptedUser = storedUser ? decryptLocalStorageUser(storedUser) : null;

  const [user, setUser] = useState(decryptedUser || null);

  // useEffect(()=>{
  //   console.log('HAHAHAHAHA',user)
  // },[])


  return (
    <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" element={<Login user={user} setUser={setUser}/>} />
            <Route exact path="/dashboard" element={<Dashboard user={user} setUser={setUser}/>} />
            <Route exact path="/branches" element={<BranchesDash user={user} setUser={setUser}/>} />
            <Route exact path="/employees" element={<EmployeesDash user={user} setUser={setUser}/>} />
            <Route exact path="/products" element={<ProductsDash user={user} setUser={setUser}/>} />
            <Route exact path="/inventory" element={<InventoryDash user={user} setUser={setUser}/>} />
            <Route exact path="/about" element={<AboutUs user={user} setUser={setUser}/>} />
            <Route exact path="/profile" element={<Profile user={user} setUser={setUser}/>}/>
            <Route exact path="/sales" element={<Sales user={user} setUser={setUser}/>}/>
            <Route exact path="/403" element={<Unauthorized/>}/>
            <Route exact path='/*' element={<NotFound/>}/>
          </Routes>
        </Router>
    </div>

  );
}

export default App;
