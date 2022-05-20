import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout";
import ViewportExample from "./components/ViewportExample";
import StressTest from "./components/StressTest";
import EventCommunication from "./components/EventCommunication";
import DragAndDrop from "./components/DragAndDrop";
import Resize from "./components/Resize";

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
            <Route index element={<ViewportExample />} />
            <Route path="viewport" element={<ViewportExample />} />
            <Route path="stress-test" element={<StressTest />} />
            <Route path="drag-drop" element={<DragAndDrop />} />
            <Route path="resize" element={<Resize />} />
            <Route
              path="event-communication"
              element={<EventCommunication />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
