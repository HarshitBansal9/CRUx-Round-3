import { Link,useNavigate} from 'react-router-dom'
import { BarChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from './hooks';
import { Combobox,ComboboxInput,ComboboxOptions,ComboboxOption} from '@headlessui/react';
import axios from 'axios';
import config from '../config';

const Navbar = ({user}:any) => {
  const [search,setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search,500);
  const [stocks,setStocks] = useState<any>([]);
  const Logout = ()=>{
    window.open(`${config.BACKEND_URL}/auth/logout`,"_self")
  };
  let navigate = useNavigate();
  useEffect(()=>{
    const loadStocks = async ()=>{
      console.log(search);
      const response = await axios.get(`${config.BACKEND_URL}/stock/search`,{params:{name:debouncedSearch}});
      setStocks(response.data.quotes);
    };
    if (debouncedSearch.length === 0) return;
    loadStocks();
  },[debouncedSearch])
  return (
    <div className="navbar dark:shadow-2xl  w-full h-[70px] flex flex-row relative dark:bg-licorice items-center">
      <div className="ml-10 absolute left-10"><Link to="/"><BarChart color='white'></BarChart></Link></div>
      <Combobox onChange={(val:any) => {
        if (!user) {alert("Sign Up first")}else{ navigate(`/stocks/${val.symbol}`)}
      }}>
        <div className='absolute left-1/4 w-[400px]'>
          <ComboboxInput placeholder='Search For A Stock...' className="w-full py-2 pl-3 pr-10 border-[1px] dark:bg-jet-black dark:text-gray-200 dark:border-black rounded-lg text-sm leading-5 text-gray-900 focus:ring-0" onChange={(event) => setSearch(event.target.value)} />
          <ComboboxOptions className="absolute mt-1 w-full overflow-auto dark:bg-jet-black rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {stocks.map((stock:any) => (
                <ComboboxOption key={stock.symbol} className="relative flex dark:hover:bg-custom-background hover:cursor-pointer gap-4 flex-row dark:bg-jet-black dark:text-gray-200 cursor-default select-none px-4 py-2 text-gray-700 hover:curosr-pointer hover:bg-gray-200" value={stock}>
                  <div className="font-bold">{stock.symbol}</div><div>{stock.longname}</div>
                </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
      <div className="flex flex-row  justify-evenly w-[350px] absolute right-[30px]">
        <div onClick={()=>{if(!user) alert("Sign Up first")}} className='hover:cursor-pointer dark:text-gray-200 dark:hover:text-gray-500'><Link to={user?("/stocks"):("/")}>Stocks</Link></div>
        <div onClick={()=>{if(!user) alert("Sign Up first")}} className='hover:cursor-pointer dark:text-gray-200 dark:hover:text-gray-500'><Link to={user?("/friends"):("/")}>Friends</Link></div>
        <div onClick={()=>{if(!user) alert("Sign Up first")}} className='hover:cursor-pointer dark:text-gray-200 dark:hover:text-gray-500'><Link to={user?("/portfolio"):("/")}>Portfolio</Link></div>
        {user ? (
          <div className="hover:cursor-pointer dark:text-gray-200 dark:hover:text-gray-500" onClick={Logout}>Logout</div>
        )
        :(
          <div className='hover:cursor-pointer dark:text-gray-200 dark:hover:text-gray-500'><Link to="login">Login</Link></div>
        )
        }
      </div>
    </div>
  )
}

export default Navbar
