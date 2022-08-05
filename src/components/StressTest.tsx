import { useEffect, useRef, useState } from "react";
import { Container, Sprite } from "pixi.js";
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import PixiRenderer from "../pixi/PixiRenderer";

const numberOfElementsOptions = [
  100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 250_000, 500_000, 1_000_000,
];

const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

function StressTest() {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numberOfElements, setNumberOfElements] = useState(100);
  const [fit, setFit] = useState(true);
  const [culling, setCulling] = useState(false);

  useEffect(() => {
    const renderer = new PixiRenderer({
      app: {
        view: canvasRef.current as HTMLCanvasElement,
        resizeTo: containerRef.current as HTMLElement,
        backgroundColor: 0x2c2c31,
      },
      viewport: {
        plugins: ["drag", "pinch", "wheel", "decelerate"],
        culling,
      },
    });

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

    renderer.render(elements);

    if (fit) {
      renderer.fit();
    }

    return () => renderer.destroy();
  }, [numberOfElements, fit, culling]);

  const handleChangeNumberOfElements = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfElements(Number(event.target.value));
  };

  const handleChangeFit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFit(event.target.checked);
  };

  const handleChangeCulling = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCulling(event.target.checked);
  };

  return (
    <Box ref={containerRef} width="100%" height="100vh" overflow="hidden">
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
            control={
              <Checkbox checked={culling} onChange={handleChangeCulling} />
            }
          />
        </Stack>
      </Toolbar>
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default StressTest;
