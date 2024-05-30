import { Link } from 'react-router-dom'

const Navbar = ({user}:any) => {
  return (
    <div className="navbar w-full h-[50px] bg-slate-600 flex items-center flex-row justify-evenly">
      {user ? (
      <div className='w-full flex justify-evenly items-center'>
        <div className='font-bold text-xl text-white'>Logo</div>
        <div className='font-bold text-xl text-white hover:cursor-pointer'>Logout</div>
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
