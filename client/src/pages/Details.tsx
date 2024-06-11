import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Line } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import axios from "axios";
import currencies from "../../currencies";
import { ChevronDown } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems,Transition } from '@headlessui/react';
function Details() {
    const location:any = useLocation()
    const [history,setHistory] = useState<any>([]);
    const [data,setData] = useState<any>([]);
    const [stockDetails,setStockDetails] = useState<any>([]);
    const [availableAmt,setAvailableAmt] = useState<number>(0);
    const [loading,setLoading] = useState<boolean>(false);
    const [holdings,setHoldings] = useState<any>([]);
    const [currChoice,setCurrChoice] = useState<string>("1W");
    const [buyShares,setBuyShares] = useState<number>(0);
    const [sellShares,setSellShares] = useState<number>(0);
    const [color,setColor] = useState<string>("");
    const path = location.pathname.split("/")[2];
    function presentedData(array:any){
        const arr = [];
        for(let i =0;i<array.length;i++){
                if (array[i].close === null){
                    arr.push({x:array[i].date.slice(0,16),y:array[i-1].close});
                } else {
                    arr.push({x:array[i].date.slice(0,16),y:array[i].close});
                }
        }
        setData(arr);
    }

    useEffect(()=>{
        async function getStocks(){     
            await axios.get("http://localhost:5000/stock/gethistory",{params:{name:path}}).then((res)=>{
                console.log(res.data);
                setHistory(res.data);
                setCurrChoice('1Y');
                presentedData(res.data.year.quotes);
                setLoading(true);
            })
        }
        async function getAmt(){
            const response  = await axios.get("http://localhost:5000/portfolio/available_amount",{withCredentials:true});
            setAvailableAmt(response.data.available_amount);
        }
        async function getHoldings(){
            const response = await axios.get("http://localhost:5000/portfolio/get_holdings",{withCredentials:true});
            setHoldings(response.data);
        }
        async function getDetails(){
            const response = await axios.get("http://localhost:5000/stock/stockdetails",{params:{name:path}});
            let test = response.data;
            test.currency = test.currency.toUpperCase();
            setStockDetails(test);
        }
        getDetails();
        getHoldings();
        getAmt();
        getStocks();
    },[path]);
    useEffect(()=>{
        if (data.length === 0){
            setColor("green");
        }
        else if (data[0].y > data[data.length-1].y){
            setColor("red");
        } else {
            setColor("green");
        };
    },[data])
    return (    
        <div className="flex items-center flex-col dark:bg-custom-background h-[800px]">
            <div className="w-full h-[70px] flex dark:bg-licorice border-b-[1px]dark:border-none items-center">
                <div className="relative left-10 flex flex-col">
                    <div className="text-2xl dark:text-gray-200 font-bold">{stockDetails.longName}</div>
                    <div className="text-lg font-bold  text-gray-400">{path}</div>
                </div>
                <div className="w-[80px] h-[40px] bg-white border-[1px] rounded-lg flex items-center justify-center flex-end text-gray-600 hover:bg-gray-100 hover:cursor-pointer absolute right-[80px]">Trade</div>
            </div>
            <div className="p-4 mt-4 h-[400px] dark:bg-licorice w-[1230px] flex flex-col justify-center items-center dark:border-none border-[1px] rounded-lg shadow-xl">
                <div className="w-full dark:bg-licorice relative flex items-center border-b-[1px] pb-2 mb-3">
                    <div className="flex flex-col ml-5">
                        <div className="text-2xl dark:text-gray-200 font-bold">{currencies[stockDetails.currency]} {stockDetails.regularMarketPrice}</div>
                        {stockDetails.regularMarketChange < 0 ?(
                            <div className="text-red-500">{(stockDetails.regularMarketChange*stockDetails.regularMarketPrice/100)?.toFixed(2)} {`(${(stockDetails.regularMarketChange)?.toFixed(2)}%)`}</div>
                        ):<div className="text-green-500">{(stockDetails.regularMarketChange*stockDetails.regularMarketPrice/100)?.toFixed(2)} {`(${(stockDetails.regularMarketChange)?.toFixed(2)}%)`}</div>
                        }
                    </div>
                    <div className="absolute right-5">
                        <Menu>
                            <MenuButton className="border-[1px] dark:bg-gray-200 h-[40px] rounded-md flex flex-row justify-center items-center gap-2 pl-2 pr-2"><div className="text-sm">{currChoice}</div><ChevronDown size={20}></ChevronDown></MenuButton>
                            <Transition enter="transition ease-out duration-75" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <MenuItems className="h-[162px] w-[100px] bg-white border-[1px] hover:cursor-pointer" anchor="bottom">
                                    <MenuItem>
                                    <div onClick={()=>{
                                        setCurrChoice("1Y");
                                        presentedData(history.year.quotes);  
                                    }} className="hover:bg-gray-200">
                                    <a className="flex justify-center items-center p-2">
                                        1Y
                                    </a>
                                    </div>
                                    </MenuItem>
                                    <MenuItem>
                                    <div onClick={()=>{
                                        setCurrChoice("1M");
                                        presentedData(history.month.quotes);
                                    }} className="hover:bg-gray-200">
                                    <a className="flex justify-center items-center p-2">
                                        1M
                                    </a>
                                    </div>
                                    </MenuItem>
                                    <MenuItem>
                                    <div onClick={()=>{
                                        setCurrChoice("1W");
                                        presentedData(history.week.quotes);
                                    }} className="hover:bg-gray-200">
                                    <a className="flex justify-center items-center p-2">
                                        1Wk
                                    </a>
                                    </div>
                                    </MenuItem>
                                    <MenuItem>
                                    <div onClick={()=>{
                                        setCurrChoice("1D");
                                        presentedData(history.day.quotes)
                                    }
                                    } className="hover:bg-gray-200">
                                    <a className="flex justify-center items-center p-2">
                                        1D
                                    </a>
                                    </div>
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    </div>
                </div>
                { loading ? (
                <div className="">
                    <Line
                    {...{
                        theme:{
                            "text":{"fill":"#919191"}
                        },
                        width: 1200,
                        height: 300,
                        margin: { top: 20, right: 20, bottom: 30, left: 60 },
                        data: [{data: data, id: `stock-${data?.[0]?.x}`}],
                        animate: true,
                        enableTouchCrosshair: true,
                        enableSlices: 'x',
                        //enableGridY: true,
                        //enableGridX: true,
                        enablePoints: false,
                        lineWidth: 2.5,
                        gridXValues: [
                            Math.min(...data.map((d:any)=>d.x)),
                        ],
                        gridYValues: [
                            Math.min(...data.map((d:any)=>d.y)),
                        ],
                        axisLeft: {
                            tickValues: 5
                        },
                        /*axisBottom: {
                            format: currChoice === "1D" ? "%d %H:%M" : "%b %d",
                        },*/
                        axisBottom:{
                            tickValues: data.map((d:any, index:number) => { if (index % Math.floor(data.length / 5) === 0) { return d.x; } return null;}).filter((value: any) => value !== null)
                        },
                        useMesh: true,
                        isInteractive: true,
                    }}
                    colors={[color]}
                    enableArea={true}
                    yScale={{
                        type: 'linear',
                        stacked: true,
                        max: 'auto',
                        min: 'auto',
                    }}
                    //xScale={{ format: "%Y-%m-%dT%H:%M:%S.%L%Z", type: "time" }}
                    //xFormat="time:%Y-%m-%dT%H:%M:%S.%L%Z"
                    curve={'linear'}
                    areaBaselineValue={
                        Math.min(...data.map((d:any)=>d.y))
                    }
                    defs={[
                        linearGradientDef('gradientA', [
                            { offset: 0, color: color },
                            { offset: 100, color: color, opacity: 0 },
                        ]),
                    ]}
                    fill={[{ match: '*', id: 'gradientA' }]}
                    />
                </div>
                ):(
                    <div className="w-[600px] h-[400px]">Loading...</div>
                )}
            </div>
            <div className="w-full h-[300px] flex flex-row justify-evenly">
                <div className="h-[280px] w-1/2 m-4 rounded-xl shadow-2xl grid grid-cols-2 dark:bg-licorice bg-white">
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative border-b-[1px] p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">Average Analyst rating:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.averageAnalystRating}</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative border-b-[1px] p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">Current Year EPS:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.epsCurrentYear}</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative border-b-[1px] p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">50 day average:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.fiftyDayAverage}</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative border-b-[1px] p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">52 week change percent:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.fiftyTwoWeekChangePercent?.toFixed(2)}%</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative border-b-[1px] p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">Forward PE:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.forwardPE}</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative border-b-[1px] p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">Regular Market Change:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.regularMarketChange}</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative border-b-[1px] p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">Regular Market Open:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.regularMarketOpen}</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative border-b-[1px] p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">Regular Market Volume:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.regularMarketVolume}</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">200 Day Average:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.twoHundredDayAverage}</div></div>
                    <div className="h-[45px] w-[350px] ml-2 mt-2 flex items-center text-md relative p-4"><div className="text-gray-600 dark:text-gray-200 ml-2 absolute left-0">Trailing PE:</div><div className="font-bold dark:text-white absolute right-0 mr-3">{stockDetails.trailingPE}</div></div>
                </div>
                <div className="w-1/2 flex flex-col">
                    <div className="h-[130px] m-4 dark:bg-licorice rounded-xl shadow-2xl bg-white">
                        <div className="w-full flex justify-center font-bold dark:text-gray-200 text-2xl">BUY</div>
                        <div className="ml-4">
                            <div className="flex justify-evenly items-center gap-8">
                                <div className="">
                                    <div className="dark:text-gray-200">Number of Shares</div>
                                    <input type="number" min="0" onChange={(e)=>{setBuyShares(Number(e.target.value))}} placeholder="Amount..." className="w-[150px] dark:bg-gray-200 max-w-xs rounded-lg border-gray-300 bg-white px-4 py-2 text-sm border-[1px] focus:border-gray-500 focus:outline-none "/>
                                </div>
                                <div onClick={async ()=>{
                                    if(buyShares<0){alert("Invalid number of shares");return;}
                                    if (buyShares*stockDetails.regularMarketPrice > availableAmt){
                                        alert("Insufficient funds");
                                        return;
                                    }
                                    alert("Transaction successful");
                                    await axios.get("http://localhost:5000/portfolio/buy",{params:{stock_ticker:path,number_of_shares:buyShares,avg_purchase_price:Number(stockDetails.regularMarketPrice),transaction_type:"BUY"},withCredentials:true});
                                }} className="border-[1px] rounded-lg w-[100px] h-[40px] flex justify-center items-center text-white bg-gray-800 hover:bg-gray-600 hover:cursor-pointer dark:bg-custom-background dark:border-black dark:hover:bg-licorice">BUY</div>
                            </div>
                        </div>
                    </div>
                    <div className="h-[130px] m-4 dark:bg-licorice rounded-xl shadow-2xl bg-white">
                        <div className="w-full flex justify-center font-bold dark:text-gray-200 text-2xl">SELL</div>
                        <div className="ml-4">
                            <div className="w-full flex justify-evenly items-center gap-8">
                                <div className="">
                                    <div className="dark:text-gray-200">Number of Shares</div>
                                    <input type="number" onChange={(e)=>{setSellShares(Number(e.target.value))}} placeholder="Amount..." className="w-[150px] dark:bg-gray-200 max-w-xs rounded-lg border-gray-300 bg-white px-4 py-2 text-sm border-[1px] focus:border-gray-500 focus:outline-none "/>
                                </div>
                                <div onClick={async ()=>{
                                    if(sellShares<0){alert("Invalid number of shares");return;}
                                    if (sellShares > holdings.filter((holding:any)=>holding.stock_ticker === path)[0].number_of_shares){
                                        alert("Insufficient shares");
                                        return;
                                    }
                                    await axios.get("http://localhost:5000/portfolio/sell",{params:{stock_ticker:path,number_of_shares:sellShares,avg_purchase_price:Number(stockDetails.regularMarketPrice),transaction_type:"SELL"},withCredentials:true});
                                    alert("Transaction successful");
                                }} className="border-[1px] rounded-lg w-[100px] h-[40px] flex justify-center items-center text-white bg-gray-800 hover:bg-gray-600 hover:cursor-pointer dark:bg-custom-background dark:border-black dark:hover:bg-licorice">SELL</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details
