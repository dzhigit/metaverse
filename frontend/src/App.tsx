
import './App.css';
import { Miner } from "./components/Miner";
import { TotalHashes } from "./components/ShowTotalHashes";

function App() {
  return (
    <div className="App">
      <Miner/>
      <TotalHashes/>
    </div>
  );
}

export default App;
