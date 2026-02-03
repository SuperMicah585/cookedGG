import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";


const SummonerInput = () => {
  const [region, setRegion] = useState("NA");
  const [summonerInput, setSummonerInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const[inputErrorMessage,setInputErrorMessage] = useState("")
  const navigate = useNavigate();


  const summonerSubmit = () => {
    if (!summonerInput.includes('#')) {
      setInputError(true)
      setInputErrorMessage("Please include the tag by using the '#' character")
      return
    }

    const [username, tag] = summonerInput.split('#')
    
    navigate(`/player/${username}/${tag}/${region}`)
  }

  const DropDown = () => {
    

    const handleChange = (event) => {
      setRegion(event.target.value);
    };

    return (
      <div className='w-20 h-full'> 
        <FormControl fullWidth variant="standard">
          <Select
            value={region}
            onChange={handleChange}
            disableUnderline
            size="small"
            sx={{
              "& .MuiSelect-select": {
                textAlign: "center",
                padding: "17px 0",
              },
            }}
          >
        <MenuItem value="NA">NA</MenuItem>
        <MenuItem value="BR">BR</MenuItem>
        <MenuItem value="LAN">LAN</MenuItem>
        <MenuItem value="LAS">LAS</MenuItem>
        <MenuItem value="KR">KR</MenuItem>
        <MenuItem value="JP">JP</MenuItem>
        <MenuItem value="EUNE">EUNE</MenuItem>
        <MenuItem value="EUW">EUW</MenuItem>
        <MenuItem value="TR">TR</MenuItem>
        <MenuItem value="ME1">ME1</MenuItem>
        <MenuItem value="RU">RU</MenuItem>
        <MenuItem value="OCE">OCE</MenuItem>
        <MenuItem value="SG2">SG2</MenuItem>
        <MenuItem value="TW2">TW2</MenuItem>
        <MenuItem value="VN2">VN2</MenuItem>

          </Select>
        </FormControl>
      </div> 
    )
  }

  return (
      <div className=" w-96">


        <div className = 'flex items-center justify-center w-full h-full h-full z-10 '> 
          <p className = 'font-extrabold text-2xl text-black'> How Cooked Is Your MMR? </p>
          </div>


        <div className='relative h-14'>
          <div className='absolute left-0 top-0 h-full z-10'> 
            <DropDown/>
          </div>
          
          <div className='absolute left-0 top-0 h-full w-full'> 
            <Input
            className={`bg-white h-full rounded-md pl-24 pr-3 border ${inputError?"border-red-500 border-2":"border-black"}`}
            fullWidth
            onChange = {(e) => setSummonerInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                e.preventDefault();
                summonerSubmit();
                }
                else{
                    setInputError(false)
                    setInputErrorMessage("")

                }
            }}
            placeholder="Search Player (player#TAG)"
            disableUnderline
            endAdornment={
                <InputAdornment position="end">
                <SearchIcon
                    onClick = {()=> summonerSubmit()}
                    sx={{ color: 'gray', cursor: 'pointer' }}
                />
                </InputAdornment>
            }
            />
            <div className = "text-red-500 font-bold">
                {inputErrorMessage}
            </div>
          </div>
        </div>
      </div>

  )
};

export default SummonerInput;