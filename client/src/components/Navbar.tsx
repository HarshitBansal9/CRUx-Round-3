import { Link } from 'react-router-dom'
import { BarChart } from 'lucide-react';

const Navbar = ({user}:any) => {
  const Logout = ()=>{
    window.open("http://localhost:5000/auth/logout","_self")
  };
  return (
    <div className="navbar border-b-[2px] w-full h-[70px] flex flex-row items-center">
      {/*user ? (
      <div className='w-full flex justify-evenly items-center'>
        <div className='font-bold text-xl text-white'>Logo</div>
        <div  className='font-bold text-xl text-white hover:cursor-pointer' onClick={Logout}>Logout</div>
      </div>
      )
      :(<div className='w-full flex justify-evenly items-center'>
        <div className='font-bold text-xl text-white'>Logo</div>
        <div className='font-bold text-xl text-white hover:cursor-pointer'><Link to="login">LogIn</Link></div>
      </div>)
    */}
      <div className="ml-10 relative left-10"><Link to="/"><BarChart></BarChart></Link></div>
      <div className="flex flex-row  justify-evenly w-[350px] absolute right-[30px]">
        <div><Link to="/stocks">Stocks</Link></div>
        <div><Link to="#">News</Link></div>
        <div><Link to="#">Portfolio</Link></div>
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
