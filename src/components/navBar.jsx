import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from "react-router-dom";
import ItsCookedLogo from '../assets/ItsCookedLogo.png'
import Button from '@mui/material/Button';

const NavBar = () =>{
  const navigate = useNavigate();
return(

        <AppBar sx={{ backgroundColor: '#27272A' }} className = 'w-full z-20' position="static">
      <Toolbar>
            
            <Button onClick = {()=>navigate("/")} sx={{ fontSize: '1.25rem' /* text-xl */ }} color="inherit">
            <img className = 'h-12 w-12' src = {ItsCookedLogo} /> cookedGG</Button>
        <div className = 'ml-20'> 
        <Button onClick = {()=>navigate("/everyone")} color="inherit">stuff</Button>
        </div>
      </Toolbar>

    </AppBar>
)


}; export default NavBar;