import { MantineProvider } from "@mantine/core";
import "./App.css";
import MainWrapper from "./components/MainWrapper";
import { theme } from "./theme";

function App() {
  return (
    <MantineProvider theme={theme}>
      <MainWrapper />
    </MantineProvider>
  );
}

export default App;
