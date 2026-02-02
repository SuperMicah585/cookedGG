import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import { getUsers } from '../../services/userData';
import { useMutation } from '@tanstack/react-query'
import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import chonc from '../../assets/chonc.png'
import iron from '../../assets/iron.png'
import bronze from '../../assets/bronze.png'
import silver from '../../assets/silver.png'
import gold from '../../assets/gold.png'
import platinum from '../../assets/platinum.png'
import diamond from '../../assets/diamond.png'
import master from '../../assets/master.png'
import grandmaster from '../../assets/grandmaster.png'
import challenger from '../../assets/challenger.png'
import emerald from '../../assets/emerald.png'

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100, 250];

const LeaderBoardTable = () =>{
const navigate = useNavigate();

  const [lowestMmrUserData,setUserData] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);


      const tierIcons = {
        IRON: iron,
        BRONZE: bronze,
        SILVER: silver,
        GOLD: gold,
        PLATINUM: platinum,
        EMERALD:emerald,
        DIAMOND: diamond,
        MASTER: master,
        GRANDMASTER: grandmaster,
        CHALLENGER: challenger
      };



  const userData = useMutation({
    mutationFn: async (quantity) => {
      return getUsers(quantity)
    },
    onSuccess: (data) => {
      setUserData(data.data)
      
    },
    onError: () => {
      setUserData([])
    },
  })

  useEffect(()=>{

    userData.mutate(10000)


},[])

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = lowestMmrUserData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (

    <div className = 'flex flex-col w-full gap-2 z-20'> 
            <Card elevation={3}>
      <CardContent>

<TableContainer component={Paper}>
  <Table>
    <TableHead>
        <TableRow>
    <TableCell colSpan={9} sx={{ backgroundColor: "#27272A", textAlign: "center", padding: "16px",borderBottom: "none"  // Add this
 }}>
  <div className = 'flex gap-2 items-center'> 
             <img src = {chonc} className = 'w-15 h-15 z-20 rounded-full'/>
             <div className = 'text-white text-extrabold text-4xl'>Players by Rank vs Avg Opponent Rank</div>
    </div>
    </TableCell>

    
  </TableRow>
      <TableRow>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Rank</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Player Name</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Tier</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>LP</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>AVG Diffy</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Wins</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Losses</TableCell>
        <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Region</TableCell>
         <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Last Updated(PST)</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {paginatedData.map((row, index) => {
        const displayRank = page * rowsPerPage + index + 1;
        return (
<TableRow className = 'hover:cursor-pointer hover:bg-gray-100' onClick={() => navigate(`/player/${row.name}/${row.tag}/${row.region}`)} key={row.id}>
          <TableCell>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              style={
                displayRank === 1 ? { backgroundColor: '#FFD700', color: '#000' } : 
                displayRank === 2 ? { backgroundColor: '#C0C0C0', color: '#000' } : 
                displayRank === 3 ? { backgroundColor: '#CD7F32', color: '#fff' } : 
                {}
              }
            >
              {displayRank}
            </div>
          </TableCell>
          <TableCell>{row.name}<div className = 'text-gray-400'> #{row.tag} </div></TableCell>
          <TableCell>
            <img
              src={tierIcons[row.tier]}
              alt={`${row.tier} icon`}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            {row.tier} {row.rank}
          </TableCell>
          <TableCell> {row.leaguepoints} </TableCell>
          <TableCell sx={{ backgroundColor: "F9FAFB", color: "#000" }} >{Number(row.elo_difference).toFixed(0)} LP</TableCell>
          <TableCell>{row.wins}</TableCell>
          <TableCell>{row.losses}</TableCell>
          <TableCell>{row.region}</TableCell>
              <TableCell>
                {new Date(row.updated_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </TableCell>
        </TableRow>
        );
      })}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TablePagination
          count={lowestMmrUserData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#27272A', color: 'white' }}
          labelRowsPerPage="Rows per page:"
          slotProps={{
            select: {
              sx: {
                color: 'white',
                '& .MuiSelect-icon': { color: 'white' }
              }
            },
            actions: {
              sx: { color: 'white' }
            }
          }}
        />
      </TableRow>
    </TableFooter>
  </Table>
</TableContainer>

</CardContent>
</Card>
    </div>
  );

}; export default LeaderBoardTable; 