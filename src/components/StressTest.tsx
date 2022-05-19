import { useEffect, useRef, useState } from "react";
import { Application, Sprite, Ticker } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Simple } from "pixi-cull";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import { drawerWidth } from "./Layout";

const toolbarHeight = 64;

const numberOfElementsOptions = [
  100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 250_000, 500_000, 1_000_000,
];

const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

function StressTest() {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const [numberOfElements, setNumberOfElements] = useState(100);
  const [fit, setFit] = useState(true);
  const [cull, setCull] = useState(false);

  useEffect(() => {
    const width = window.innerWidth - drawerWidth;
    const height = window.innerHeight - toolbarHeight;

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

    const rows = Math.round(Math.sqrt(numberOfElements));
    const columns = rows;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const sprite = Sprite.from("./logo192.png");
        sprite.position.set(i * 200, j * 200);
        viewport.addChild(sprite);
      }
    }

    if (fit) {
      viewport.fit();
    }

    if (cull) {
      const simpleCull = new Simple(); // new SpatialHash()
      simpleCull.addList(viewport.children);
      simpleCull.cull(viewport.getVisibleBounds());

      // cull whenever the viewport moves
      Ticker.shared.add(() => {
        if (viewport.dirty) {
          simpleCull.cull(viewport.getVisibleBounds());
          viewport.dirty = false;
        }
      });
    }

    return () => app.destroy(false, { children: true });
  }, [numberOfElements, fit, cull]);

  const handleChangeNumberOfElements = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfElements(Number(event.target.value));
  };

  const handleChangeFit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFit(event.target.checked);
  };

  const handleChangeCull = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCull(event.target.checked);
  };

  return (
    <>
      <Toolbar
        sx={{
          backgroundColor: "#ffffff17",
          borderBottom: "1px solid #ffffff1f",
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            select
            size="small"
            label="No. Elements"
            value={numberOfElements}
            onChange={handleChangeNumberOfElements}
            sx={{ width: 150 }}
          >
            {numberOfElementsOptions.map((value) => (
              <MenuItem key={value} value={value}>
                {formatNumber(value)}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            label="Fit content"
            control={<Checkbox checked={fit} onChange={handleChangeFit} />}
          />
          <FormControlLabel
            label="Enable culling"
            control={<Checkbox checked={cull} onChange={handleChangeCull} />}
          />
        </Stack>
      </Toolbar>
      <canvas ref={containerRef} />
    </>
  );
}

export default StressTest;
