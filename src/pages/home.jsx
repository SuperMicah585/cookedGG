import { useState } from 'react'
import SummonerInput from '../components/homeComponents/summonerInput'
import NavBar from '../components/navBar'
import TopLosers from '../components/homeComponents/topLosers'
import Background from '../assets/TFTSet16Background.png'
function Home() {

  return (
<div className ='absolute left-0 top-0 w-screen h-screen bg-white'>
    <div className = 'flex flex-col relative w-full h-full bg-gray-50 overflow-y-scroll'>
    <div className = 'w-full z-12'>
      <NavBar/>
    </div>
    <div className="absolute w-full h-full">
              <img
                className="w-full h-full"
                src={Background}
                alt="background"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none" />
            </div>
             
      <div className='flex w-full mt-12 md:mt-32 lg:mt-40 justify-center z-12'>
          <SummonerInput/>
      </div>
      <div className = 'flex w-full p-5 sm:p-10 lg:p-20 justify-center z-12 mt-24'>
        <TopLosers/>
      </div>

</div>
    </div>


  )
}

export default Home
