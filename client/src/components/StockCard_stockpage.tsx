import { Heart } from "lucide-react";
import { Minus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
interface IPROPS{
  company:string;
  name: string;
  price: number;
  change: number;
  iffave:boolean;
  sendDataToParent: (data:any)=>void;
}
function StockCard_stockpage({company,name, price, change,sendDataToParent,iffave}:IPROPS) {
  function handleClick(flag:boolean) {
    sendDataToParent({
      company,
      name,
      price,
      change,
      remove:flag
    });
  }
  return (
    <div>
      <div className="bg-white flex flex-col mt-4 rounded-lg border-[1px] shadow-2xl border-gray-300 w-[250px] h-[200px]">
        <div className="h-[60px] w-full flex items-center">
          <Link to={`/stocks/${name}`}>
            <div className="ml-4 w-[150px] mt-4">
              {company.split(" ").length > 3 ?(
                <div className="text-sm font-bold hover:underline hover:cursor-pointer">{company}</div>
              ):(
                <div className="text-lg font-bold hover:underline hover:cursor-pointer">{company}</div>
              )
              }
                <div className="text-gray-400 text-sm">{name}</div>
            </div>
          </Link>
          {
          change < 0 ? 
          <div className="w-[60px] h-[30px] ml-3 bg-red-100 rounded-xl flex justify-center items-center"><div className="text-red-600 text-md">{change.toFixed(1)}%</div></div>:
          <div className="w-[60px] h-[30px] ml-3 bg-green-100 rounded-xl flex justify-center items-center"><div className="text-green-600 text-md">+{change.toFixed(1)}%</div></div>
          }
        </div>
        <div className="h-[80px] w-full flex items-center">
          <div className="ml-4 mt-6 w-[200px]">
              <div className="text-2xl text-black font-bold">${price.toFixed(2)}</div>
              <div className="text-gray-500 text-sm">Last Traded Price</div>
          </div>
        </div>
        <div className="h-[60px] w-full flex flex-row mt-4 items-center">
          <div className="h-[30px] w-[80px] border-[1px] flex ml-6  mb-6 rounded-md hover:cursor-pointer items-center justify-center text-gray-500">Trade</div>
          {iffave?(
          <div onClick={()=>{
            async function removeFav(){
              await axios.get("http://localhost:5000/stock/removefavourite",{params:{name:name},withCredentials:true});
            }
            removeFav();
            handleClick(true)}} className="h-[30px] w-[30px] flex ml-[90px]  mb-6 rounded-md hover:cursor-pointer items-center justify-center"><Minus></Minus></div>)
          :(<div onClick={()=>{
            async function addFav(){
              await axios.get("http://localhost:5000/stock/addfavourite",{params:{name:name},withCredentials:true});
            }
            addFav();
            handleClick(false);
            }
          } 
            className="h-[30px] w-[30px] flex ml-[90px]  mb-6 rounded-md hover:cursor-pointer items-center justify-center hover:scale-125 duration-100 text-gray-500"><Heart className="hover:fill-red-400"></Heart>
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default StockCard_stockpage
