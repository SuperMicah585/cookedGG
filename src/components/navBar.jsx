import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from "react-router-dom";
import ItsCookedLogo from '../assets/ItsCookedLogo.png'
import Button from '@mui/material/Button';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useState } from 'react'

const NavBar = () =>{
  const navigate = useNavigate();
  const [activePage,setActivePage] = useState('home')
  console.log(activePage)
return(

        <AppBar sx={{ backgroundColor: '#27272A',color:'white' }} className = 'w-full z-20' position="static">
      <Toolbar>
            
            <Button onClick = {()=>{navigate("/");setActivePage('home')}} sx={{ fontSize: '1.25rem'}} color="inherit">
            <img className = 'h-12 w-12' src = {ItsCookedLogo} /> cookedGG</Button>
        <div className = 'ml-12'> 
        <Button color="inherit" startIcon={<BarChartIcon />} onClick={() => { navigate("/data"); setActivePage('data'); }}>Data</Button>
        </div>
      </Toolbar>

    </AppBar>
)


}; export default NavBar;