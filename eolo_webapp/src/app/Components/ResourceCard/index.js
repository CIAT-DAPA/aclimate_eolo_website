import { Card, CardContent, CardMedia, Typography, Link } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ResourceCard({ image, title, description, link }) {
  return (
    <Card
      sx={{
        maxWidth: 340,
        m: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 380
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", color: "#951E51" }}
        >
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="inherit"
            sx={{ display: "flex", alignItems: "center", gap: "2px" }}
          >
            {title} <OpenInNewIcon fontSize="small" />
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
