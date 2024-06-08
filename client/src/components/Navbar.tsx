import { Link } from 'react-router-dom'
import { BarChart } from 'lucide-react';

const Navbar = ({user}:any) => {
  const Logout = ()=>{
    window.open("http://localhost:5000/auth/logout","_self")
  };
  return (
    <div className="navbar border-b-[2px] w-full h-[70px] flex flex-row relative items-center">
      <div className="ml-10 absolute left-10"><Link to="/"><BarChart></BarChart></Link></div>
      <input type="text" placeholder="Search For a Stock..." className='w-[500px] rounded-lg px-4 py-4 bg-gray-100 absolute left-1/4 h-[40px] border-[1px]'></input>
      <div className="flex flex-row  justify-evenly w-[350px] absolute right-[30px]">
        <div><Link to="/stocks">Stocks</Link></div>
        <div><Link to="#">News</Link></div>
        <div><Link to="/portfolio">Portfolio</Link></div>
        {user ? (
          <div className="hover:cursor-pointer" onClick={Logout}>Logout</div>
        )
        :(
          <div><Link to="login">Login</Link></div>
        )
        }
      </div>
    </div>
  )
}

export default Navbar
