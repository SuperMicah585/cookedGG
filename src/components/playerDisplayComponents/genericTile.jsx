import { Card, CardContent } from "@mui/material";

const GenericTile = ({ data, description, dataColor, descriptionColor }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 24px -8px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent sx={{ py: 2.5, px: 2.5, "&:last-child": { pb: 2.5 } }}>
        <div className="flex flex-col w-full h-full gap-1">
          <div
            className={`font-audiowide tabular-nums ${descriptionColor} text-3xl md:text-5xl tracking-tight`}
          >
            {data}
          </div>
          <div className={`${dataColor} text-sm font-medium uppercase tracking-wider opacity-80`}>
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenericTile;