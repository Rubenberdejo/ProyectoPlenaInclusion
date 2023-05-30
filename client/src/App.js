import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from './components/Navbar'
import CambioContra from "./components/CambioContra";
import CambioEmail from "./components/CambioEmail";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
      <Navbar/> 
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/registerUser" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/CambioContra" element={<CambioContra/>} />
          <Route path="/CambioEmail" element={<CambioEmail/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;