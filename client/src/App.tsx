import Navbar from './components/Navbar';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import axios from 'axios';
import { useEffect,useState } from 'react';
const App = () =>{
  const [user,setUser] = useState(null);
  useEffect(()=>{
    const getUser =  async ()=>{
      await fetch("http://localhost:5000/auth/login/success",{
        method:"GET",
        credentials:"include",
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Credentials":"true",
        },
    }).then((res)=>{
      if (res.status === 200){
        return res.json();
      }
      throw new Error("Failed to authenticate user");
    }).then((resJson:any)=>{
      setUser(resJson.user)
    }).catch((err)=>{
      console.log(err);
    })
    };
    async function getStocks(){
      const response = await axios.get("http://localhost:5000/stock/getstocks",{withCredentials:true});
      console.log(response.data);
    }
    getStocks();
    getUser();
  },[])
  console.log(user);
  return (
    <BrowserRouter>
    <div>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="/login" element={user?<Navigate to="/"/>:<Login />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
