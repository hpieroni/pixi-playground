import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import PixiRenderer from "../pixi/PixiRenderer";
import TruncatedText from "../pixi/TruncatedText";

function TruncatedTextExample() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = new PixiRenderer({
      view: canvasRef?.current as HTMLCanvasElement,
      resizeTo: containerRef?.current as HTMLElement,
      backgroundColor: 0x2c2c31,
    });

    const text =
      "Loremipsumdolorsitamet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    const style = { fontSize: 24, fill: 0xffffff };
    const maxWidth = 165;

    const example1 = new TruncatedText(text, style, maxWidth);
    example1.x = 20;
    example1.y = 20;

    const example2 = new TruncatedText(text, style, maxWidth, { maxLines: 3 });
    example2.x = 300;
    example2.y = 20;

    renderer.render([example1, example2]);

    return () => renderer.destroy();
  }, []);

  return (
    <Box ref={containerRef} width="100%" height="100vh" overflow="hidden">
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default TruncatedTextExample;
