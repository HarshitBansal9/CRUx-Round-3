import { Link,useNavigate} from 'react-router-dom'
import { BarChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from './hooks';
import { Combobox,ComboboxInput,ComboboxOptions,ComboboxOption} from '@headlessui/react';
import axios from 'axios';
const Navbar = ({user}:any) => {
  const [search,setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search,500);
  const [stocks,setStocks] = useState<any>([]);
  const Logout = ()=>{
    window.open("http://localhost:5000/auth/logout","_self")
  };
  let navigate = useNavigate();
  useEffect(()=>{
    const loadStocks = async ()=>{
      console.log(search);
      const response = await axios.get("http://localhost:5000/stock/search",{params:{name:debouncedSearch}});
      setStocks(response.data.quotes);
    };
    if (debouncedSearch.length === 0) return;
    loadStocks();
  },[debouncedSearch])
  return (
    <div className="navbar border-b-[2px] w-full h-[70px] flex flex-row relative items-center">
      <div className="ml-10 absolute left-10"><Link to="/"><BarChart></BarChart></Link></div>
      <Combobox onChange={(val:any) => {
        navigate(`/stocks/${val.symbol}`)
      }}>
        <div className='absolute left-1/4 w-[400px]'>
          <ComboboxInput placeholder='Search For A Stock...' className="w-full py-2 pl-3 pr-10 border-[1px] rounded-lg text-sm leading-5 text-gray-900 focus:ring-0" onChange={(event) => setSearch(event.target.value)} />
          <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {stocks.map((stock:any) => (
                <ComboboxOption key={stock.symbol} className="relative flex gap-4 flex-row cursor-default select-none px-4 py-2 text-gray-700 hover:curosr-pointer hover:bg-gray-200" value={stock}>
                  <div className="font-bold">{stock.symbol}</div><div>{stock.longname}</div>
                </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
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
