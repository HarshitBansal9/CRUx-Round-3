import { useEffect, useState } from "react";
import axios from "axios";
import Holding from "../components/Holding";
import Transaction from "../components/Transaction";
import { ListOrdered } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems,Transition } from '@headlessui/react'
import { Link } from "react-router-dom";
function Portfolio() {
    const [availableAmt,setAvailableAmt] = useState<number>(0);
    const [addAmt,setAddAmt] = useState<number>(0);
    const [searchedStock,setSearchedStock] = useState<string>("");
    const [moneyInvested,setMoneyInvested] = useState<number>(0);
    const [stocksSold,setStocksSold] = useState<number>(0);
    const [details,setDetails] = useState<any>("Search For A Stock...")
    const [holdings,setHoldings] = useState<any>([]);
    const [sort,setSort] = useState<string>("default");
    const [choice,setChoice] = useState<string>("buy");
    const [transactions,setTransactions] = useState<any>([]);
    function displayHoldings(){
        if(sort==="default"){
            return holdings.map((holding:any)=>{return <Holding stock_ticker={holding.stock_ticker} shares={Number(holding.number_of_shares)} price={Number(holding.avg_purchase_price)}></Holding>});
        } else if(sort==="price"){
            return holdings.sort((a:any,b:any)=>Number(b.avg_purchase_price)-Number(a.avg_purchase_price)).map((holding:any)=>{return <Holding stock_ticker={holding.stock_ticker} shares={Number(holding.number_of_shares)} price={Number(holding.avg_purchase_price)}></Holding>});
        } else if(sort==="value"){
            return holdings.sort((a:any,b:any)=>Number(b.avg_purchase_price)*Number(b.number_of_shares)-Number(a.avg_purchase_price)*Number(a.number_of_shares)).map((holding:any)=>{return <Holding stock_ticker={holding.stock_ticker} shares={Number(holding.number_of_shares)} price={Number(holding.avg_purchase_price)}></Holding>});
        } else if(sort==="shares"){
            return holdings.sort((a:any,b:any)=>Number(b.number_of_shares)-Number(a.number_of_shares)).map((holding:any)=>{return <Holding stock_ticker={holding.stock_ticker} shares={Number(holding.number_of_shares)} price={Number(holding.avg_purchase_price)}></Holding>});
        }
    }
    useEffect(()=>{
        async function getAmt(){
            const response  = await axios.get("http://localhost:5000/portfolio/available_amount",{withCredentials:true});
            setAvailableAmt(response.data.available_amount);
        }
        getAmt();
        async function getHoldings(){
            const response = await axios.get("http://localhost:5000/portfolio/get_holdings",{withCredentials:true});
            setHoldings(response.data);
        }
        getHoldings();
        async function getTransactions(){
            const response = await axios.get("http://localhost:5000/portfolio/get_transactions",{withCredentials:true});
            setTransactions(response.data);
            let sum1 = 0;
            let sum2 = 0;
            for(let i =0;i<response.data.length;i++){
                if (response.data[i].transaction_type === "BUY"){
                    sum1+=Number(response.data[i].transaction_price);
                } else {
                    sum2+=Number(response.data[i].transaction_price);
                }
            }
            setMoneyInvested(sum1);
            setStocksSold(sum2);
        }
        getTransactions();
    },[]);
    return (
        <div className="flex flex-col">
            <div className="w-full h-[100px] flex border-b-[1px] items-center relative">
                <div className="text-3xl font-bold absolute left-10">Portfolio</div>
                <div className="w-[300px] absolute h-full items-center right-[5px] flex-row flex justify-evenly">
                    <input onChange={(e)=>{setAddAmt(parseInt(e.target.value))}} type="Number" min="0" placeholder="Add amount..." className="w-[150px] absol max-w-xs rounded-lg border-gray-300 bg-gray-100 px-4 py-2 text-sm border-[1px] focus:border-gray-500 focus:outline-none "/>
                    <div onClick={async ()=>{
                        let x = Number(availableAmt)+Number(addAmt);
                        setAvailableAmt(x);
                        await axios.get("http://localhost:5000/portfolio/add_amount",{withCredentials:true,params:{amount:addAmt}});
                    }} className="border-[1px] w-[60px] flex justify-center hover:cursor-pointer hover:bg-white items-center rounded-lg bg-gray-100 h-[35px]">Add</div> 
                </div>
            </div>
            <div className="w-full h-[100px] flex border-b-[1px] items-center relative">
                <div className="text-2xl absolute left-10">Available Amount:   ${availableAmt}</div>
                <div className="absolute flex justify-center right-[500px] flex-col">
                    <div className="text-xl">Total Money Invested: ${moneyInvested}</div>
                    <div className="text-xl">Total Holdings: ${holdings.reduce(((acc:number,curr:any)=>acc + curr.number_of_shares*curr.avg_purchase_price),0)}</div>
                </div>
                <div className="w-[300px] absolute h-full flex items-center right-[5px] text-2xl">
                    Stocks Sold:${stocksSold}
                </div>
            </div>
                <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    <section>
                <div className="flex flex-row w-full relative">
                    <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>
                    <div className="absolute right-0">
                        <Menu>
                            <MenuButton className="border-[1px] w-[100px] h-[40px] rounded-md flex flex-row justify-evenly items-center"><ListOrdered size={18}></ListOrdered><div className="text-sm">Sort by</div></MenuButton>
                            <Transition enter="transition ease-out duration-75" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <MenuItems className="h-[162px] w-[100px] bg-white border-[1px] hover:cursor-pointer" anchor="bottom">
                                    <MenuItem>
                                    <div onClick={()=>{setSort("default")}} className="hover:bg-gray-200">
                                    <a className="flex justify-center items-center p-2">
                                        Default
                                    </a>
                                    </div>
                                    </MenuItem>
                                    <MenuItem>
                                    <div onClick={()=>{setSort("price")}} className="hover:bg-gray-200">
                                    <a className="flex justify-center items-center p-2">
                                        Price
                                    </a>
                                    </div>
                                    </MenuItem>
                                    <MenuItem>
                                    <div onClick={()=>{setSort("value")}} className="hover:bg-gray-200">
                                    <a className="flex justify-center items-center p-2">
                                        Value
                                    </a>
                                    </div>
                                    </MenuItem>
                                    <MenuItem>
                                    <div onClick={()=>{setSort("shares")}} className="hover:bg-gray-200">
                                    <a className="flex justify-center items-center p-2">
                                        Shares
                                    </a>
                                    </div>
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-4 items-center">
                        <div className="font-medium">Stock</div>
                        <div className="font-medium">Shares</div>
                        <div className="font-medium">Price</div>
                        <div className="font-medium text-right">Value</div>
                    </div>
                    <div>
                    {
                        displayHoldings()
                    }
                    </div>
                </div>
                </section>
                <section>
                <h2 className="text-2xl font-bold mb-4">Trading History</h2>
                <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-4 items-center">
                    <div className="font-medium">Date</div>
                    <div className="font-medium">Symbol</div>
                    <div className="font-medium">Action</div>
                    <div className="font-medium text-right">Amount</div>
                    </div>
                    {transactions.map((transaction:any)=>{
                        return <Transaction date={transaction.transaction_date} stock_ticker={transaction.stock_ticker} amount={Number(transaction.transaction_price)} action={transaction.transaction_type}></Transaction>
                    })}
                </div>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Trade</h2>
                    <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                    <div className="w-full flex h-[40px] flex-row relative">
                        {(choice==="buy")?(<div onClick={()=>{setChoice("buy")}} className="text-gray-600 border-r-[1px] border-black pr-4 hover:text-gray-400 underline hover:cursor-pointer flex items-center">Buy</div>):(<div onClick={()=>{setChoice("buy")}} className="text-gray-600 border-r-[1px] border-black pr-4 hover:text-gray-400 hover:cursor-pointer flex items-center">Buy</div>)}
                        {(choice==="sell")?(<div onClick={()=>{setChoice("sell")}} className="text-gray-600 border-l-[1px] underline border-black pl-4 hover:text-gray-400 hover:cursor-pointer flex items-center">Sell</div>):(<div onClick={()=>{setChoice("sell")}} className="text-gray-600 border-l-[1px] border-black pl-4 hover:text-gray-400 hover:cursor-pointer flex items-center">Sell</div>)}
                        <div className="flex flex-row absolute right-4">
                            <input type="text" onChange={(e)=>{setSearchedStock(e.target.value)}} placeholder="Search Stock..." className="w-[150px] max-w-xs rounded-lg border-gray-300 bg-white px-4 py-2 text-sm border-[1px] focus:border-gray-500 focus:outline-none "/>
                            <div onClick={async ()=>{
                                await axios.get("http://localhost:5000/stock/search_exact",{withCredentials:true,params:{stock_ticker:searchedStock}}).then(
                                    (response)=>{
                                        setDetails(response.data.longName)
                                    }
                                ).catch((error)=>{
                                    setDetails("Doesn't Exist")
                                    console.log("error");
                                })   
                            }} className="border-[1px] rounded-lg w-[60px] text-gray-600 bg-gray-300 flex justify-center items-center hover:text-gray-400 hover:cursor-pointer ml-2">Search</div>
                        </div>
                    </div>
                    {(choice === "buy") ?(
                        (details == "Search For A Stock..." || details == "Doesn't Exist") ? (<div>{details}</div>):(     
                        <div>       
                            <Link className="flex flex-row" to={`../stocks/${searchedStock}`}> Click Here: <div className="hover:underline">{details}</div></Link>
                        </div>
                    )
                    ):(
                        <div>
                            <div className="font-bold text-xl">Select Which Stock To Sell:</div>
                            <div className="flex flex-col">
                                {holdings.map((holding:any)=>{return <Link className="hover:underline" to={`../stocks/${holding.stock_ticker}`}>{holding.stock_ticker}</Link>})}
                            </div>
                        </div>
                    )}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Portfolio
