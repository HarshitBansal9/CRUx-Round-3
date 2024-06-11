import { ListOrdered } from "lucide-react"
import { useState,useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems,Transition } from '@headlessui/react'
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
import StockCard_stockpage from "../components/StockCard_stockpage";
function Stocks() {
    const [favouriteStocks,setFavouriteStocks] = useState<any>([]);
    const [popStocks,setPopStocks] = useState<any>([]);
    const [searchQuery,setSearchQuery] = useState<string>("");
    const [sort,setSort] = useState<string>("default");
    function displayStocks(array:any){
        let flag:boolean;
        if (array===favouriteStocks){
            flag = true;
        } else {
            flag = false;
        }
        if(sort==="default"){
            return array.filter(function compare(x:any){return x.company.toLowerCase().includes(searchQuery)}).map((stock:any)=>{

                return <StockCard_stockpage  currency={stock.currency} sendDataToParent={handleDataFromChild} company={stock.company} name={stock.name} price={stock.price} change={stock.change} iffave={flag}></StockCard_stockpage>
            });;
        } else if(sort==="price"){
            return array.sort((a:any,b:any)=>a.price-b.price).filter(function compare(x:any){return x.company.toLowerCase().includes(searchQuery)}).map((stock:any)=>{
                return <StockCard_stockpage  currency={stock.currency} sendDataToParent={handleDataFromChild} company={stock.company} name={stock.name} price={stock.price} change={stock.change} iffave={flag}></StockCard_stockpage>
            });
        } else if(sort==="change"){
            return array.sort((a:any,b:any)=>a.change-b.change).filter(function compare(x:any){return x.company.toLowerCase().includes(searchQuery)}).map((stock:any)=>{
                return <StockCard_stockpage  currency={stock.currency} sendDataToParent={handleDataFromChild} company={stock.company} name={stock.name} price={stock.price} change={stock.change} iffave={flag}></StockCard_stockpage>
            });
        } else {
            return array.sort((a:any,b:any)=>a.company.localeCompare(b.company)).filter(function compare(x:any){return x.company.toLowerCase().includes(searchQuery)}).map((stock:any)=>{
                return <StockCard_stockpage  currency={stock.currency} sendDataToParent={handleDataFromChild} company={stock.company} name={stock.name} price={stock.price} change={stock.change} iffave={flag}></StockCard_stockpage>
            });
        }
    }
    function handleDataFromChild(data:any) {
        if(data.remove){
            setFavouriteStocks(favouriteStocks.filter((stock:any)=>stock.name!==data.name));
            setPopStocks([...popStocks,data]);
        } else {
            setPopStocks(popStocks.filter((stock:any)=>stock.name!==data.name));
            setFavouriteStocks([...favouriteStocks,data]);
        }
    }
    useEffect(()=>{ 
        async function getFavStocks(array:any){
            const response = await axios.get(`${BACKEND_URL}/stock/getfavourite`,{withCredentials:true});
            let array1 = [];
            let array2 = [];
            for (let i = 0 ;i<array.length;i++){
                if (response.data.includes(array[i].name)){
                    array1.push(array[i]);
                } else {
                    array2.push(array[i]);
                }
            }
            setFavouriteStocks(array1);
            setPopStocks(array2);
        }
      async function getStocks(){
        const response = await axios.get(`${BACKEND_URL}/stock/getstocks`,{withCredentials:true});
        getFavStocks(response.data);
      } 
      getStocks();
    },[])
    return (
        <div className="dark:bg-custom-background no-scrollbar lg:h-[1000px]">
            <div className="w-full h-[100px] shadow-2xl dark:bg-licorice flex items-center">
                <div className="text-3xl font-bold absolute  dark:text-gray-200 left-10">Stock Market Dashboard</div>
                <div className="w-[400px] absolute right-[5px] flex-row flex justify-evenly">
                    <input type="text" onChange={
                        (e)=>{
                            setSearchQuery(e.target.value);
                        }
                    } placeholder="Search stocks..." className="w-[150px] dark:bg-gray-400 dark:border-none dark:shadow-xl dark:text-black dark:placeholder-black absol max-w-xs rounded-lg border-gray-300 bg-gray-100 px-4 py-2 text-sm border-[1px] focus:border-gray-500 focus:outline-none "/>
                    <Menu>
                        <MenuButton className="border-[1px] w-[100px] rounded-md dark:bg-gray-400 dark:border-none dark:shadow-xl flex flex-row justify-evenly items-center"><ListOrdered size={18}></ListOrdered><div className="text-sm">Sort by</div></MenuButton>
                        <Transition enter="transition ease-out duration-75" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <MenuItems className="h-[162px] w-[100px] dark:border-black dark:bg-gray-400 bg-white border-[1px] hover:cursor-pointer" anchor="bottom">
                                <MenuItem>
                                <div onClick={()=>{setSort("default")}} className="hover:bg-gray-200">
                                <a className="flex justify-center dark:bg-gray-400 dark:hover:bg-gray-200  items-center p-2">
                                    Default
                                </a>
                                </div>
                                </MenuItem>
                                <MenuItem>
                                <div onClick={()=>{setSort("price")}} className="hover:bg-gray-200">
                                <a className="flex justify-center dark:bg-gray-400 dark:hover:bg-gray-200  items-center p-2">
                                    Price
                                </a>
                                </div>
                                </MenuItem>
                                <MenuItem>
                                <div onClick={()=>{setSort("change")}} className="hover:bg-gray-200">
                                <a className="flex justify-center dark:bg-gray-400 dark:hover:bg-gray-200  items-center p-2">
                                    Change
                                </a>
                                </div>
                                </MenuItem>
                                <MenuItem>
                                <div onClick={()=>{setSort("company")}} className="hover:bg-gray-200">
                                <a className="flex justify-center dark:bg-gray-400 dark:hover:bg-gray-200  items-center p-2">
                                    Name
                                </a>
                                </div>
                                </MenuItem>
                            </MenuItems>
                        </Transition>
                    </Menu>   
                </div>
            </div>
            <div className="flex flex-col pb-10 ml-10 mt-4">
                <div className="text-2xl font-bold dark:text-gray-200">Favourite Stocks</div>
                <div className="mt-2">
                    {
                        favouriteStocks.length === 0 ? 
                        <div className="text-md text-stone-500">No favorite stocks added yet.</div>:
                        <div className="w-full m-0 grid grid-cols-4 gap-4">
                            {   
                                displayStocks(favouriteStocks)
                            }
                        </div>
                    }
                </div>
            </div>
            <div className="absolute w-full pl-10 dark:bg-custom-background">
                <div className="w-full flex flex-col">
                    <div className="text-2xl font-bold dark:text-gray-200">Popular Stocks</div>
                    <div className="grid grid-cols-4 m-0 mb-4 w-full">
                        {
                            displayStocks(popStocks)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stocks
