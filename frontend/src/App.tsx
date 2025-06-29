import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewPage from "./pages/NewPage";
import D3Page from "./pages/D3Page";
import Miner from "./pages/Miner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<NewPage />} />
        <Route path="/d3" element={<D3Page />} />
        <Route path="/miner" element={<Miner />} />

        
      </Routes>
    </Router>
  );
}

export default App;


