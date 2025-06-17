import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import HomeLogin from "./pages/HomeLogin";
import Chatroom from "./pages/Chatroom";
import EditProfile from "./pages/EditProfile";
import Logout from "./components/Logout";
import About from "./pages/About";
import Sell from "./pages/Sell";
import ProductDetail from "./pages/ProductDetail";
import Filtered from "./pages/Filtered";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/HomeLogin" element={<HomeLogin />} />
        <Route path="/Chatroom" element={<Chatroom />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/About" element={<About />} />
        <Route path="/Sell" element={<Sell />} />
        <Route path="/item/:id" element={<ProductDetail />} />
        <Route path="/filtered" element={<Filtered />} />
        {/* Add more routes here as needed */}
      </Routes>
    </div>
  );
}

export default App;
