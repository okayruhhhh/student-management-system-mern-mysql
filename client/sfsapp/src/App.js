import './App.css';
import Home from "./Home";
import Create from "./Create";
import Update from "./Update";
import NavBar from "./NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/create"  element={<Create />} />
        <Route path="/update"  element={<Update />} />
        <Route path="*"        element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;