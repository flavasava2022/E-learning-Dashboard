import { useSidebar } from "../../context/SidebarContext";
import { Box, Divider, Drawer, ListSubheader, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
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
import ModeIcon from "@mui/icons-material/Mode";
import { ListItemButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          icon: <AccountCircleIcon />,
          path: "/dashboard/settings/profile",
        },
        { text: "Courses", icon: <MenuBookIcon />, path: "/dashboard/courses" },
        { text: "Order History", icon: <HistoryIcon />, path: "/orders" },
      ],
    },
    {
      header: "Instructor",
      show: role === "instructor",
      items: [
        { text: "Enrolled Courses", icon: <SchoolIcon />, path: "/courses" },
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
        { text: "Logout", icon: <LogoutIcon />, path: "/logout" },
      ],
    },
  ];
  return (
    <List
      component={motion.div}
      sx={{
        background: "#32323f",
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
      animate={{
        width: isOpen ? "250px" : "70px",
      }}
      transition={{ type: "tween" }}
    >
      {menuItems
        .filter((section) => section?.show)
        .map((section, index) => (
          <Fragment key={index}>
            <ListSubheader
              sx={{
                background: "inherit",
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
              <Tooltip placement="right" title={item?.text} key={item.text}>
                <ListItemButton
                  sx={{
                    color: "white",
                    "&.Mui-selected, &.Mui-selected:hover": {
                      background: "#2d9cdb",
                      color: "#ffffff",
                    },
                    "& .MuiListItemIcon-root": {
                      minWidth: 0,
                      mr: 2,
                      color: "white",
                    },
                    "&:hover": {
                      background: "#ffbf00",
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
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key={`text-${item.text}`}
                        initial={{ opacity: 0, x: -20, display: "none" }}
                        animate={
                          isOpen && { opacity: 1, x: 0, display: "block" }
                        }
                        exit={{ opacity: 0, x: -20, display: "none" }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        style={{ overflow: "hidden" }}
                      >
                        <ListItemText
                          primary={item.text}
                          sx={{ whiteSpace: "nowrap" }} // Prevent text wrapping
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListItemButton>
              </Tooltip>
            ))}
          </Fragment>
        ))}
    </List>
  );
}
