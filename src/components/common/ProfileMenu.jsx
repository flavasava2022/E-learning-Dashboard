import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import persistStore from "redux-persist/es/persistStore";
import { Typography } from "@mui/material";
import { logoutUser } from "../../store/userSlice";

export default function ProfileMenu() {
  const { user, role } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    persistStore.purge(); // Clear persisted storage
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              ml: 2,
              border: "2px solid transparent",
              transition: "border-color 0.3s",
              "&:hover": { borderColor: "#2d9cdb" },
            }}
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 45,
                height: 45,
                bgcolor: user?.avatar_url ? "transparent" : "#2d9cdb",
                fontWeight: "bold",
                fontSize: 18,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.1)" },
              }}
              alt={`${user?.first_name} ${user?.last_name}`}
              src={user?.avatar_url}
            >
              {`${user?.first_name?.charAt(0).toUpperCase()}${user?.last_name?.charAt(0).toUpperCase()}`}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.2))",
              mt: 1.5,
              borderRadius: 2,
              minWidth: 230,
              "& .MuiMenuItem-root": {
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  bgcolor: "#ffbf00",
                  color: "white",
                  "& svg": { color: "white" },
                },
              },
              "& .MuiAvatar-root": {
                width: 36,
                height: 36,
                ml: -0.5,
                mr: 1.5,
                bgcolor: "#2d9cdb",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            navigate("/dashboard/settings/profile");
          }}
          sx={{ cursor: "pointer" }}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt={`${user?.first_name} ${user?.last_name}`}
            src={user?.avatar_url}
          >
            {`${user?.first_name?.charAt(0).toUpperCase()}${user?.last_name?.charAt(0).toUpperCase()}`}
          </Avatar>
          Profile
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            navigate("/dashboard/settings");
          }}
          sx={{ cursor: "pointer" }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem
          onClick={async () => {
            await handleLogout();
          }}
          sx={{ cursor: "pointer" }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <Typography sx={{ color: "error.main", fontWeight: "bold" }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
