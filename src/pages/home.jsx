import { useState } from 'react'
import SummonerInput from '../components/homeComponents/summonerInput'
import NavBar from '../components/navBar'
import Background from '../assets/tftLeaderBoard.png'
import Info from '../components/homeComponents/info'
import { LinkButton } from '../components/homeComponents/LinkButton'
function Home() {

  return (
<div className ='absolute left-0 top-0 w-screen h-screen bg-white'>
    <div className = 'flex flex-col relative w-full h-full bg-gray-100 overflow-y-scroll'>
    <div className = 'w-full z-12'>
      <NavBar/>
    </div>
    <div className="absolute w-full h-full">
              <img
                className="w-full h-full opacity-60"
                src={Background}
                alt="background"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none" />
            </div>
             
      <div className='flex w-full mt-12 md:mt-32 lg:mt-40 justify-center z-12'>
          <SummonerInput/>
      </div>

    <div className="flex flex-col items-center gap-3 mt-32 z-20">
      <span className="text-gray-600 text-sm font-medium uppercase tracking-wide">Popular players</span>
      <div className="flex flex-wrap gap-3 justify-center">
        <LinkButton name="K3soju" link="/player/VIT%20K3soju/000/NA" />
        <LinkButton name="Setsuko" link="/player/vit%20setsuko/na2/NA" />
        <LinkButton name="Dishsoap" link="/player/dishsoap/na3/NA" />
      </div>
    </div>

      <div className='flex flex-col lg:flex-row justify-center items-center z-20 flex mt-12 w-full gap-10 pb-20'>
        <Info iconId = {1} title = 'Are You Cooked?' description='This tool shows the rank difference between the searched player and the lobby for the last 10 ranked games. You can see where you stand compared to other players in the data tab.'/>
        <Info iconId = {20}  title = 'What Does This Mean?' description='If the searched player has a large positive difference, they most likely have bad MMR. Bad MMR will make one lose more points than gain in ranked matches.'/>
        <Info iconId = {15} title = 'Things To Consider' description = 'High elo players(think top 500) will often have "bad" MMR because the match making system is unable to find similar ranked players. Another thing that might throw off MMR in this tracker is duoing with another player - especially if that player has a significantly different rank.'/>
      </div>


</div>
    </div>


  )
}

export default Home
