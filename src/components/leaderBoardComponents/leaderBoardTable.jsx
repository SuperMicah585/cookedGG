import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import { getUsers } from '../../services/userData';
import { useMutation } from '@tanstack/react-query'
import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import chonc from '../../assets/chonc.png'
const LeaderBoardTable = () =>{
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

    userData.mutate(10000)


},[])


  return (

    <div className = 'flex flex-col w-full gap-2 z-20'> 
            <Card elevation={3}>
      <CardContent>
<TableContainer component={Paper} sx={{ maxHeight: 600 }}>
  <Table>
    <caption>We have arrived at the least cooked</caption>
    <TableHead>
        <TableRow>
    <TableCell colSpan={8} sx={{ backgroundColor: "#27272A", textAlign: "center", padding: "16px",borderBottom: "none"  // Add this
 }}>
           <div className = 'flex gap-2 items-center'> 
             <img src = {chonc} className = 'w-15 h-15 z-20 rounded-full'/>
             <div className = 'text-white text-extrabold text-4xl'>Cooked Leaderboard </div>
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
          <TableCell>            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              style={
                id === 0 ? { backgroundColor: '#FFD700', color: '#000' } : 
                id === 1 ? { backgroundColor: '#C0C0C0', color: '#000' } : 
                id === 2 ? { backgroundColor: '#CD7F32', color: '#fff' } : 
                {}
              }
            >
              {id+1}
            </div></TableCell>
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

</CardContent>
</Card>
    </div>
  );

}; export default LeaderBoardTable; 