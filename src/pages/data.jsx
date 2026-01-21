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
<div className="fixed inset-0 w-screen h-screen">
  {/* Background image - positioned absolutely */}
  <div className="absolute top-0 left-0 h-1/4 md:h-1/2 lg:h-3/4 w-full z-0">
    <img 
      className="opacity-75 h-full w-full object-cover" 
      src={TFTLeaderBoardBackGround} 
      alt="background"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 pointer-events-none" />
  </div>

  {/* Scrollable content */}
  <div className="absolute inset-0 overflow-y-auto z-10">
    <div className="flex flex-col items-center gap-2">
      <NavBar />
      
      <div className="flex flex-col items-center w-full max-w-7xl gap-10 mt-10 md:mt-32 lg:mt-64 p-2 pb-20">
        <div className="w-full h-96 lg:h-[700px]">
          <LeaderBoardDistribution key={windowWidth} />
        </div>
        <div className="w-full h-96 lg:h-[700px]">
          <ScatterPlot key={`scatter-${windowWidth}`} />
        </div>
        <div className="w-full">
          <LeaderBoardTable />
        </div>
      </div>
    </div>
  </div>
</div>
)

}

export default Leaderboard;