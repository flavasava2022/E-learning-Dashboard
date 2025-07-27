import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import { useLocation, useNavigate } from "react-router";

export default function NavSettings() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "My Details", path: "/dashboard/settings" },
    { text: "Profile", path: "/dashboard/settings/profile" },

    { text: "Password", path: "/dashboard/settings/password" },
    { text: "Notification", path: "/dashboard/settings/notification" },
  ];
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders" className="flex">
        {menuItems.map((item) => (
          <List
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: 0,
            }}
            key={item.text}
          >
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                sx={{
                  color: "black",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#2d9cdb",
                  },
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "#2d9cdb",
                  },
                }}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </List>
        ))}
      </nav>
    </Box>
  );
}
