import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';

const LeaderBoardTable = () =>{


const rows = [
  { id: 1, name: "Alice", rank: 1, elo_difference: "12", date: "2025-12-01", LP: 2500, winrate: "72%", wins: 36, losses: 14 },
  { id: 2, name: "Bob", rank: 2, elo_difference: "8", date: "2025-12-02", LP: 2400, winrate: "68%", wins: 34, losses: 16 },
  { id: 3, name: "Charlie", rank: 3, elo_difference: "15", date: "2025-12-03", LP: 2600, winrate: "75%", wins: 38, losses: 12 },
  { id: 4, name: "Diana", rank: 4, elo_difference: "5", date: "2025-12-04", LP: 2300, winrate: "63%", wins: 30, losses: 18 },
  { id: 5, name: "Ethan", rank: 5, elo_difference: "20", date: "2025-12-05", LP: 2700, winrate: "78%", wins: 39, losses: 11 },
  { id: 6, name: "Fiona", rank: 6, elo_difference: "10", date: "2025-12-06", LP: 2450, winrate: "70%", wins: 35, losses: 15 },
  { id: 7, name: "George", rank: 7, elo_difference: "18", date: "2025-12-07", LP: 2650, winrate: "74%", wins: 37, losses: 13 },
  { id: 8, name: "Hannah", rank: 8, elo_difference: "4", date: "2025-12-08", LP: 2250, winrate: "60%", wins: 28, losses: 20 },
  { id: 9, name: "Ibrahim", rank: 9, elo_difference: "11", date: "2025-12-09", LP: 2550, winrate: "71%", wins: 36, losses: 14 },
  { id: 10, name: "Julia", rank: 10, elo_difference: "7", date: "2025-12-10", LP: 2350, winrate: "66%", wins: 33, losses: 17 },
];


  return (

    <div className = 'flex flex-col w-full gap-2 z-20'> 
            <Card elevation={3}>
      <CardContent>
<TableContainer component={Paper}>
  <Table>
    <caption>Last updated on 12/20/2025</caption>
    <TableHead>
      <TableRow>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Player Name</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Tier</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Elo Difference</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>LP</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Winrate</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Wins</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Losses</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.rank}</TableCell>
          <TableCell>{row.elo_difference}</TableCell>
          <TableCell>{row.LP}</TableCell>
          <TableCell>{row.winrate}</TableCell>
          <TableCell>{row.wins}</TableCell>
          <TableCell>{row.losses}</TableCell>
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