import { Outlet, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";

export const drawerWidth = 240;

const routes = [
  { to: "viewport", text: "Viewport" },
  { to: "stress-test", text: "Stress Test" },
  { to: "drag-drop", text: "Drag & Drop" },
  { to: "resize", text: "Resize" },
  { to: "event-communication", text: "Event Communication" },
];

const Layout = () => (
  <Box sx={{ display: "flex" }}>
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          backgroundColor: "#ffffff17",
          width: drawerWidth,
        },
      }}
    >
      <Toolbar disableGutters>
        <a href="https://pixijs.com/">
          <Box
            component="img"
            src="./pixijs-logo.svg"
            alt="pixijs logo"
            height={32}
            px={2}
          />
        </a>
      </Toolbar>
      <List>
        {routes.map(({ to, text }) => (
          <ListItem
            key={to}
            disablePadding
            divider
            component={NavLink}
            to={to}
            sx={{
              color: "text.primary",
              "&.active": {
                borderLeft: "4px solid #ea1e63",
              },
            }}
          >
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
    <Box component="main" flexGrow={1}>
      <Outlet />
    </Box>
  </Box>
);

export default Layout;
