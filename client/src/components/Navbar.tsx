import { Link } from 'react-router-dom'

const Navbar = ({user}:any) => {
  const Logout = ()=>{
    window.open("http://localhost:5000/auth/logout","_self")
  };
  return (
    <div className="navbar w-full h-[50px] bg-slate-600 flex items-center flex-row justify-evenly">
      {user ? (
      <div className='w-full flex justify-evenly items-center'>
        <div className='font-bold text-xl text-white'>Logo</div>
        <div  className='font-bold text-xl text-white hover:cursor-pointer' onClick={Logout}>Logout</div>
      </div>
      )
      :(<div className='w-full flex justify-evenly items-center'>
        <div className='font-bold text-xl text-white'>Logo</div>
        <div className='font-bold text-xl text-white hover:cursor-pointer'><Link to="login">LogIn</Link></div>
      </div>)
      }
    </div>
  )
}

export default Navbar
