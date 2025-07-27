import { useSidebar } from "../../context/SidebarContext";
import { Box, Divider, Drawer, ListSubheader } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import List from "@mui/material/List";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import { ListItemButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { Fragment } from "react";

export default function DesktopNavDashboard({ role }) {
  const { isOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(logoutUser());
    persistor.purge(); // Clear persisted storage
  };

  const menuItems = [
    {
      show: true,
      items: [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        {
          text: "My Profile",
          icon: <SchoolIcon />,
          path: "/dashboard/courses",
        },
        { text: "Enrolled Courses", icon: <SettingsIcon />, path: "/settings" },
        { text: "Order History", icon: <SettingsIcon />, path: "/orders" },
      ],
    },
    {
      header: "Instructor",
      show: role === "instructor",
      items: [
        { text: "my Courses", icon: <SchoolIcon />, path: "/courses" },
        { text: "assignments", icon: <SchoolIcon />, path: "/courses" },
      ],
    },

    {
      header: "User",
      show: true,
      items: [
        {
          text: "Settings",
          icon: <SettingsIcon />,
          path: "/dashboard/settings",
        },
        { text: "Logout", icon: <SettingsIcon />, path: "/logout" },
      ],
    },
  ];
  return (
    <List
      sx={{
        // Change background color of the whole List (drawer)
        width: isOpen ? "25%" : "5%",
        transition: "width 1s",
        bgcolor: "#32323f",
        height: "100%",
        boxShadow: 3,

        borderRadius: 3,
        // Style ListItemButton states
        "& .MuiListItemButton-root": {
          borderRadius: 2,
          mx: 1,
          my: 0.5,
        },
      }}
    >
      {menuItems
        .filter((section) => section?.show)
        .map((section, index) => (
          <Fragment key={index}>
            <ListSubheader
              sx={{
                bgcolor: "inherit",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                textTransform: "uppercase",
                pl: 2,
                fontSize: "1rem",
                display: isOpen ? "block" : "none",
                transition: "display 0.3s ease",
              }}
              disableSticky
            >
              {section.header}
            </ListSubheader>
            {section.items.map((item) => (
              <ListItemButton
                key={item.text}
                sx={{
                  color: "white",
                  "&.Mui-selected, &.Mui-selected:hover": {
                    bgcolor: "#2d9cdb",
                    color: "#ffffff",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 0,
                    mr: 2,
                    color: "white",
                  },
                  "&:hover": {
                    bgcolor: "#ffbf00",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                  },
                }}
                selected={location.pathname === item.path}
                onClick={() =>
                  item?.path === "/logout"
                    ? handleLogout()
                    : navigate(item.path)
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    display: isOpen ? "block" : "none",
                    transition: "display 0.3s ease",
                  }}
                />
              </ListItemButton>
            ))}
          </Fragment>
        ))}
    </List>
  );
}
