import { useEffect, useRef, useState } from "react";
import { Sprite } from "pixi.js";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import PixiRenderer from "../pixi/PixiRenderer";

const numberOfElementsOptions = [
  100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 250_000, 500_000, 1_000_000,
];

const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

function StressTest() {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numberOfElements, setNumberOfElements] = useState(100);
  const [renderer, setRenderer] = useState<PixiRenderer>();
  const [culling, setCulling] = useState(false);

  useEffect(() => {
    const renderer = new PixiRenderer({
      view: canvasRef.current as HTMLCanvasElement,
      resizeTo: containerRef.current as HTMLElement,
      backgroundColor: 0x2c2c31,
    });

    setRenderer(renderer);

    const rows = Math.round(Math.sqrt(numberOfElements));
    const columns = rows;
    const elements = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const sprite = Sprite.from("./logo192.png");
        sprite.position.set(i * 200, j * 200);
        elements.push(sprite);
      }
    }

    renderer.render(elements, {
      plugins: ["drag", "pinch", "wheel", "decelerate"],
      culling,
      fit: true,
    });

    return () => renderer.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfElements]);

  const handleChangeNumberOfElements = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfElements(Number(event.target.value));
  };

  const handleFit = () => {
    renderer?.fit();
  };

  const handleChangeCulling = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cullingChecked = event.target.checked;
    setCulling(cullingChecked);
    if (cullingChecked) {
      renderer?.enableCulling();
    } else {
      renderer?.disableCulling();
    }
  };

  return (
    <Box height="100vh">
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
          <Button
            color="inherit"
            startIcon={<FitScreenIcon />}
            onClick={handleFit}
          >
            Fit content
          </Button>
          <FormControlLabel
            label="Enable culling"
            control={
              <Checkbox checked={culling} onChange={handleChangeCulling} />
            }
          />
        </Stack>
      </Toolbar>
      <Box height="calc(100% - 64px)" overflow="hidden" ref={containerRef}>
        <canvas ref={canvasRef} />
      </Box>
    </Box>
  );
}

export default StressTest;
