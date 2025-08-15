import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router";
export default function OverviewCard({
  count = 0,
  title = "All Courses",
  link = "#",
}) {
  return (
    <Card
      elevation={4}
      sx={{
        maxWidth: 340,
        width: "100%",
        borderRadius: 3,
        boxShadow: 4,
        p: 0,
        mx: 2,
        bgcolor: "white",
        transition:
          "box-shadow 0.3s, background 0.3s, color 0.3s, transform 0.3s",
        "&:hover": {
          bgcolor: "#2d9cdb",
          color: "white",
          boxShadow: 8,
          transform: "translateY(-6px) scale(1.04)",
          "& .MuiAvatar-root": {
            backgroundColor: "white",
            color: "#2d9cdb",
            border: "#ffbf00 3px solid",
          },
          "& .MuiTypography-root": {
            color: "white",
          },
          "& .MuiButton-root": {
            color: "white",
            "&:hover": { color: "#ffbf00", textDecoration: "none" },
          },
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",

          gap: 2,
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              fontSize: 24,
              fontWeight: 700,
              background: "#2d9cdb",
              color: "white",
              boxShadow: 3,

              border: "3px solid #fff",
            }}
          >
            {count}
          </Avatar>
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Button
            component={Link}
            to={link}
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontWeight: 600,
              color: "#2d9cdb",
              transition: "color 0.3s",
              px: 0,
              minWidth: 0,
            }}
            variant="text"
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
