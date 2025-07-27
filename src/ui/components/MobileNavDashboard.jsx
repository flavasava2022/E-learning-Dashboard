import React from "react";
import { useSidebar } from "../../context/SidebarContext";
import { Drawer, ListSubheader } from "@mui/material";
import List from "@mui/material/List";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import { ListItemButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { logoutUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
export default function MobileNavDashboard({ role }) {
  const { isOpen, openNavbar } = useSidebar();

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
        { text: "My Profile", icon: <SchoolIcon />, path: "/courses" },
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
        { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
        { text: "Logout", icon: <SettingsIcon />, path: "/logout" },
      ],
    },
  ];

  return (
    <Drawer
      open={isOpen}
      onClose={openNavbar}
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          width: "80%",
        },
      }}
    >
      <List
        sx={{
          bgcolor: "background.paper",
          height: "100%",

          borderRadius: 2,
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
          .map((section) => (
            <>
              <ListSubheader
                sx={{
                  bgcolor: "inherit",
                  color: "text.secondary",
                  fontWeight: "bold",
                  textAlign: "center",
                  textTransform: "uppercase",
                  pl: 2,
                  fontSize: "1rem",
                  transition: "display 0.3s ease",
                }}
                disableSticky
              >
                {section.header}
              </ListSubheader>
              {section.items.map((item) => (
                <ListItemButton
                  sx={{
                    "&.Mui-selected, &.Mui-selected:hover": {
                      bgcolor: "#2d9cdb",
                      color: "#ffffff",
                      "& .MuiListItemIcon-root": { color: "#ffffff" },
                    },
                    "& .MuiListItemIcon-root": {
                      minWidth: 0,
                      mr: 2,
                      color: "#2d9cdb",
                    },
                    "&:hover": {
                      bgcolor: "#ffbf00",
                      color: "primary.main",
                      "& .MuiListItemIcon-root": { color: "primary.main" },
                    },
                  }}
                  key={item.text}
                  selected={location.pathname === item.path}
                  onClick={() =>
                    item?.path === "/logout"
                      ? handleLogout
                      : navigate(item.path)
                  }
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </>
          ))}
      </List>
    </Drawer>
  );
}
