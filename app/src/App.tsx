import { MantineProvider } from "@mantine/core";
import "./App.css";
import MainWrapper from "./components/MainWrapper";

function App() {
  return (
    <MantineProvider>
      <MainWrapper />
    </MantineProvider>
  );
}

export default App;
