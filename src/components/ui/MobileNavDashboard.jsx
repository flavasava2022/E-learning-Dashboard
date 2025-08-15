import React, { Fragment } from "react";
import { useSidebar } from "../../context/SidebarContext";
import { Drawer, ListSubheader, Tooltip } from "@mui/material";
import List from "@mui/material/List";

import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import { ListItemButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { logoutUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import persistStore from "redux-persist/es/persistStore";
export default function MobileNavDashboard({ role }) {
  const { isOpen, openNavbar } = useSidebar();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(logoutUser());
    persistStore.purge(); // Clear persisted storage
  };
  const menuItems = [
    {
      show: true,
      items: [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        {
          text: "My Profile",
          icon: <AccountCircleIcon />,
          path: "/dashboard/settings/profile",
        },
        { text: "Courses", icon: <MenuBookIcon />, path: "/dashboard/courses" },
      ],
    },
    {
      show: role === "instructor",
      items: [
        { text: "My Courses", icon: <SchoolIcon />, path: "/dashboard/mycourses" },
      ],
    },

    {

      show: true,
      items: [
        {
          text: "Settings",
          icon: <SettingsIcon />,
          path: "/dashboard/settings",
        },
        { text: "Logout", icon: <LogoutIcon />, path: "/logout" },
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
          .map((section,index) => (
            <Fragment key={index}>

              {section.items.map((item) => (
                <ListItemButton
                  key={item.text}
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
            </Fragment>
          ))}
      </List>
    </Drawer>
  );
}
