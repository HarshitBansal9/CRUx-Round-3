import Navbar from './components/Navbar';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
const App = () =>{
  const user:boolean = false;
  return (
    <BrowserRouter>
    <div>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user?<Navigate to="/"/>:<Login />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
