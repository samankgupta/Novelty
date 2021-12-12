import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home'
import Game from './Components/Game'
import Stake from './Components/Stake'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stake" element={<Stake />} />
          <Route path="/play" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
