import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout";
import Viewport from "./components/Viewport";
import StressTest from "./components/StressTest";
import EventCommunication from "./components/EventCommunication";
import DragAndDrop from "./components/DragAndDrop";
import Resize from "./components/Resize";
import PixiLayout from "./components/PixiLayout";
import TruncatedText from "./components/TruncatedText";
import Tooltip from "./components/Tooltip";
import HitArea from "./components/HitArea";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/pixi-playground" element={<Layout />}>
            <Route index element={<Viewport />} />
            <Route path="viewport" element={<Viewport />} />
            <Route path="stress-test" element={<StressTest />} />
            <Route path="drag-drop" element={<DragAndDrop />} />
            <Route path="resize" element={<Resize />} />
            <Route path="truncated-text" element={<TruncatedText />} />
            <Route path="tooltip" element={<Tooltip />} />
            <Route path="hit-area" element={<HitArea />} />
            <Route
              path="event-communication"
              element={<EventCommunication />}
            />
            <Route path="layout" element={<PixiLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
