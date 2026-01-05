import Home from './pages/home'
import Leaderboard from './pages/leaderboard'
import UserDisplay from './pages/playerDisplay'
import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NavBar from './components/navBar'
import Data from './pages/data'
const queryClient = new QueryClient()
import './App.css'
import './index.css'
function App() {


  return (
  
 <QueryClientProvider client={queryClient}>
  <Routes> 
    <Route path="/" element={<Home />} />
    <Route path="/player/:player/:tag/:region" element={<UserDisplay />} />
    <Route path="/leaderboard" element={<Leaderboard />} />
    <Route path="/data" element={<Data />} />


  </Routes>
</QueryClientProvider>
  )
}
//https://metatft-matches-2.ams3.digitaloceanspaces.com/NA1_5449502245.json
export default App
