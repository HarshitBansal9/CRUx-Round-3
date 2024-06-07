import { useEffect, useState } from "react";
import axios from "axios";
import Holding from "../components/Holding";
import Transaction from "../components/Transaction";
import { Link } from "react-router-dom";
function Portfolio() {
    const [availableAmt,setAvailableAmt] = useState<number>(0);
    const [addAmt,setAddAmt] = useState<number>(0);
    const [searchedStock,setSearchedStock] = useState<string>("");
    const [details,setDetails] = useState<any>("Search For A Stock...")
    const [holdings,setHoldings] = useState<any>([]);
    const [choice,setChoice] = useState<string>("buy");
    const [transactions,setTransactions] = useState<any>([]);
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
        }
        getTransactions();
    },[]);
    return (
        <div className="flex flex-col">
            <div className="w-full h-[100px] flex border-b-[1px] items-center relative">
                <div className="text-3xl font-bold absolute left-10">Portfolio</div>
                <div className="absolute right-1/2 ml-4 text-2xl font-bold">Available Amount:   ₹{availableAmt}</div>
                <div className="w-[300px] absolute h-full items-center right-[5px] flex-row flex justify-evenly">
                    <input onChange={(e)=>{setAddAmt(parseInt(e.target.value))}} type="text" placeholder="Add amount..." className="w-[150px] absol max-w-xs rounded-lg border-gray-300 bg-gray-100 px-4 py-2 text-sm border-[1px] focus:border-gray-500 focus:outline-none "/>
                    <div onClick={async ()=>{
                        let x = Number(availableAmt)+Number(addAmt);
                        setAvailableAmt(x);
                        await axios.get("http://localhost:5000/portfolio/add_amount",{withCredentials:true,params:{amount:addAmt}});
                    }} className="border-[1px] w-[60px] flex justify-center hover:cursor-pointer hover:bg-white items-center rounded-lg bg-gray-100 h-[35px]">Add</div> 
                </div>
            </div>
                <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    <section>
                <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>
                <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-4 items-center">
                    <div className="font-medium">Stock</div>
                    <div className="font-medium">Shares</div>
                    <div className="font-medium">Price</div>
                    <div className="font-medium text-right">Value</div>
                    </div>
                    {holdings.map((holding:any)=>{
                        return <Holding stock_ticker={holding.stock_ticker} shares={Number(holding.number_of_shares)} price={Number(holding.avg_purchase_price)}></Holding>
                    })}
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
                        <div onClick={()=>{setChoice("buy")}} className="text-gray-600 border-r-[1px] border-black pr-4 hover:text-gray-400 hover:cursor-pointer flex items-center">Buy</div>
                        <div onClick={()=>{setChoice("sell")}} className="text-gray-600 border-l-[1px] border-black pl-4 hover:text-gray-400 hover:cursor-pointer flex items-center">Sell</div>
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
