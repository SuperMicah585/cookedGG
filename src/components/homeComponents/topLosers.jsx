import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect,useState } from 'react';
import { getUsers } from '../../services/userData';
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import chonc from '../../assets/chonc.png'




function MyTable() {
const navigate = useNavigate();


  const [lowestMmrUserData,setUserData] = useState([])


  const userData = useMutation({
    mutationFn: async (quantity) => {
      return getUsers(quantity)
    },
    onSuccess: (data) => {
      setUserData(data.data)
      
    },
    onError: (error) => {
      setInputError(true)
      setInputErrorMessage(error.message ?? "Validation failed")
    },
  })

  useEffect(()=>{

    userData.mutate(10)


},[])

  return (

    <div className = 'flex flex-col items-start gap-2 w-full max-w-7xl'> 


<TableContainer component={Paper}>
  <Table>
    <caption>The best of the worst. Maximum cookediness</caption>
    <TableHead>
        <TableRow>
    <TableCell colSpan={8} sx={{ backgroundColor: "#27272A", textAlign: "center", padding: "16px",borderBottom: "none"  // Add this
 }}>
  <div className = 'flex gap-2 items-center'> 
             <img src = {chonc} className = 'w-15 h-15 z-20 rounded-full'/>
             <div className = 'text-white text-extrabold text-4xl'>10 Worst MMRs </div>
    </div>
    </TableCell>
  </TableRow>
      <TableRow>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Rank</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Player Name</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Tier</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>AVG Diffy</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Wins</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Losses</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Region</TableCell>
         <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Last Updated(PST)</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {lowestMmrUserData.map((lowestMmrUserData,id) => (
<TableRow className = 'hover:cursor-pointer hover:bg-gray-100' onClick={() => navigate(`/player/${lowestMmrUserData.name}/${lowestMmrUserData.tag}/${lowestMmrUserData.region}`)} key={lowestMmrUserData.id}>
          <TableCell>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              style={
                id === 0 ? { backgroundColor: '#FFD700', color: '#000' } : 
                id === 1 ? { backgroundColor: '#C0C0C0', color: '#000' } : 
                id === 2 ? { backgroundColor: '#CD7F32', color: '#fff' } : 
                {}
              }
            >
              {id+1}
            </div>
          </TableCell>
          <TableCell>{lowestMmrUserData.name}#{lowestMmrUserData.tag}</TableCell>
          <TableCell>{lowestMmrUserData.tier} {lowestMmrUserData.rank} {lowestMmrUserData.leaguepoints}LP</TableCell>
          <TableCell>{lowestMmrUserData.elo_difference}</TableCell>
          <TableCell>{lowestMmrUserData.wins}</TableCell>
          <TableCell>{lowestMmrUserData.losses}</TableCell>
          <TableCell>{lowestMmrUserData.region}</TableCell>
              <TableCell>
                {new Date(lowestMmrUserData.updated_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


    </div>
  );
}; export default MyTable;