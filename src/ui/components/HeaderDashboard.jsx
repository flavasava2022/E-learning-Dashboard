import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useSidebar } from "../../context/SidebarContext";
import ProfileMenu from "../../pages/Dashboard/components/ProfileMenu";

export default function HeaderDashboard() {
  const { openNavbar } = useSidebar();
  return (
    <Box className="flex items-center gap-2 w-full max-w-dvw">
      <IconButton
        edge="start"
        color="primary"
        aria-label="open drawer"
        onClick={openNavbar}
      >
        {" "}
        <MenuIcon sx={{ width: "38px", height: "38px" }} />
      </IconButton>
      <OutlinedInput
        id="outlined-adornment-weight"
        fullWidth
        sx={{
          borderRadius: 12,
          padding: "0 12px",
          height: "40px",
          maxWidth: "600px",
        }}
        endAdornment={
          <IconButton size="small" color="primary" aria-label="search">
            {" "}
            <SearchIcon />
          </IconButton>
        }
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          "aria-label": "weight",
        }}
      />

      <div className="flex items-center gap-2 ml-auto">
        <ProfileMenu />
      </div>
    </Box>
  );
}
