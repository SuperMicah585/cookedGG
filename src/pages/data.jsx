import NavBar from '../components/navBar'
import LeaderBoardDistribution from '../components/DataComponents/barGraph'
import {useEffect,useState} from 'react'
import TFTLeaderBoardBackGround from '../assets/tftLeaderBoard.png'
import ScatterPlot from '../components/DataComponents/scatterPlot';
import LeaderBoardTable from '../components/leaderBoardComponents/leaderBoardTable';
const Leaderboard = () =>{

      const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
      useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

return(
<div className ='absolute left-0 top-0 w-screen h-screen'>

    <div className = 'flex flex-col relative w-full h-full overflow-y-scroll bg-gray-50 gap-2 items-center'>
      <NavBar/>
<div className="absolute top-0 left-0 h-1/4 md:h-1/2 lg:h-3/4 w-full">
  <img 
    className="opacity-75 h-full w-full" 
    src={TFTLeaderBoardBackGround} 
    alt="background"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none" />
</div>
<div className='flex flex-col items-center justify-center w-full max-w-7xl gap-10 mt-10 md:mt-32 lg:mt-64 p-2'>
<LeaderBoardDistribution key={windowWidth}/>
<ScatterPlot key={windowWidth +1}/>
<LeaderBoardTable/>
</div>
</div>

</div>
)

}

export default Leaderboard;