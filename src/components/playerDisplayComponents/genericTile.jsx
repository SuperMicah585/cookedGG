import { Card,CardContent } from "@mui/material";

const GenericTile = ({data,description,dataColor,descriptionColor}) =>{



    return(

<Card elevation={3}>
      <CardContent>
        <div className = 'flex flex-col w-full h-full'>
            <div className = {`${descriptionColor} text-5xl`}>{data} </div>  
            <div className = {`${dataColor}`}> {description}</div>
          
        </div>
      </CardContent>
</Card>
    )


}; export default GenericTile;