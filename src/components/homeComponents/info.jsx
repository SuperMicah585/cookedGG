import { Description } from "@mui/icons-material";
import { Card,CardContent } from "@mui/material";

const Info = ({description,title,iconId}) =>{


const randomIcon = `https://ddragon.leagueoflegends.com/cdn/15.24.1/img/profileicon/${iconId}.png`
    return(
<Card elevation={3} className="w-80 md:w-92 h-72">
  <CardContent>
    <div className="flex flex-col gap-2 mt-5">
    <div className="flex items-center justify-center w-full">
        <img
        className="w-20 h-20 rounded-full ring-3 ring-violet-300 shadow-lg"
        src={randomIcon}
        />

    </div>
      <div className="text-md md:text-xl font-bold">{title}</div>
      <div className="text-xs">{description}</div>
    </div>
  </CardContent>
</Card>

    )
}; export default Info;