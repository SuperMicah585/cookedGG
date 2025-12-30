import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect,useState } from 'react';
import { getWorstTenMMR } from '../../services/userData';
import { useMutation } from '@tanstack/react-query'





function MyTable() {

  const [lowestMmrUserData,setUserData] = useState([])
  console.log(lowestMmrUserData)
  const userData = useMutation({
    mutationFn: async () => {
      return getWorstTenMMR()
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

    userData.mutate()


},[])

  return (

    <div className = 'flex flex-col items-start gap-2 w-full max-w-7xl'> 

    <div> 

        Top 10 Cooked MMRs
    </div>
<TableContainer component={Paper}>
  <Table>
    <caption>Last updated on 12/20/2025</caption>
    <TableHead>
      <TableRow>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Player Name</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Rank</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>10 game Avg</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Wins</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Losses</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Region</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {lowestMmrUserData.map((lowestMmrUserData) => (
        <TableRow key={lowestMmrUserData.id}>
          <TableCell>{lowestMmrUserData.name}#{lowestMmrUserData.tag}</TableCell>
          <TableCell>{lowestMmrUserData.tier} {lowestMmrUserData.rank} {lowestMmrUserData.leaguepoints}LP</TableCell>
          <TableCell>{lowestMmrUserData.elo_difference}</TableCell>
          <TableCell>{lowestMmrUserData.wins}</TableCell>
          <TableCell>{lowestMmrUserData.losses}</TableCell>
          <TableCell>{lowestMmrUserData.region}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


    </div>
  );
}; export default MyTable;