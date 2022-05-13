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
import { Application, Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";

const drawerWidth = 240;
const AppBarWidth = 64;

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Scene() {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const width = window.innerWidth - drawerWidth;
    const height = window.innerHeight - AppBarWidth;

    if (containerRef?.current) {
      const app = new Application({
        view: containerRef?.current as HTMLCanvasElement,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundColor: 0x2c2c31,
        width,
        height,
      });

      // create viewport
      const viewport = new Viewport({
        screenWidth: width,
        screenHeight: height,
        // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        interaction: app.renderer.plugins.interaction,
      });

      // add the viewport to the stage
      app.stage.addChild(viewport);

      // activate plugins
      viewport.drag().pinch().wheel().decelerate();

      const logo: Sprite = Sprite.from("./logo192.png");
      logo.anchor.set(0.5);
      logo.x = 100;
      logo.y = 100;
      viewport.addChild(logo);
    }
  }, [containerRef]);

  return <canvas ref={containerRef} />;
}

function App() {
  return (
    // <Scene />

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
        <Box component="main">
          <Toolbar />
          <Scene />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
