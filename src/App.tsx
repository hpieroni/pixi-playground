import { useEffect, useRef } from "react";
import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Application, Sprite, Container } from "pixi.js";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Scene() {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const app = new Application({
      view: containerRef?.current as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x2c2c31,
    });

    const conty: Container = new Container();
    conty.x = 0;
    conty.y = 0;
    app.stage.addChild(conty);

    const logo: Sprite = Sprite.from("./logo192.png");
    logo.anchor.set(0.5);
    logo.x = 100;
    logo.y = 100;
    conty.addChild(logo);
  }, []);

  return <canvas ref={containerRef} />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" component="h1">
              Pixi.js Playground
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Simple Example" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Scene />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
