import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Line } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import axios from "axios";
import { ArrowDown, ChevronDown } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems,Transition } from '@headlessui/react';
function Details() {
    const location:any = useLocation()
    const [history,setHistory] = useState<any>([]);
    const [data,setData] = useState<any>([]);
    const [stockDetails,setStockDetails] = useState<any>([]);
    const [loading,setLoading] = useState<boolean>(false);
    const [currChoice,setCurrChoice] = useState<string>("1W");
    const [currStocks,setCurrStocks] = useState<any>([]);
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
                setHistory(res.data);
                setCurrChoice('1D');
                presentedData(res.data.day.quotes);
                setLoading(true);
            })
        }
        getStocks();
    },[]);
    useEffect(()=>{ 
        async function getStocks(){
          const response = await axios.get("http://localhost:5000/stock/getstocks",{withCredentials:true});
          for (let i = 0; i < response.data.length; i++){
            if (response.data[i].name === path){
                setCurrStocks(response.data[i]);
                break;
            }
          }
        }
        async function getDetails(){
            const response = await axios.get("http://localhost:5000/stock/stockdetails",{params:{name:path}});
            console.log(response.data);
            setStockDetails(response.data);
        }
        getDetails();
        getStocks();
      },[])
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
        <div className="flex items-center flex-col h-[800px]">
            <div className="w-full h-[70px] flex  border-b-[1px] items-center">
                <div className="relative left-10 flex flex-col">
                    <div className="text-2xl font-bold">{currStocks.company}</div>
                    <div className="text-lg font-bold  text-gray-400">{path}</div>
                </div>
                <div className="w-[80px] h-[40px] bg-white border-[1px] rounded-lg flex items-center justify-center flex-end text-gray-600 hover:bg-gray-100 hover:cursor-pointer absolute right-[80px]">Trade</div>
            </div>
            <div className="p-4 mt-4 h-[400px] w-[1230px] flex flex-col justify-center items-center border-[1px] rounded-lg shadow-xl">
                <div className="w-full relative flex items-center border-b-[1px] pb-2 mb-3">
                    <div className="flex flex-col ml-5">
                        <div className="text-2xl font-bold">${currStocks.price}</div>
                        {currStocks.change < 0 ?(
                            <div className="text-red-500">{(currStocks.change*currStocks.price/100)?.toFixed(2)} {`(${(currStocks.change)?.toFixed(2)}%)`}</div>
                        ):<div className="text-green-500">{(currStocks.change*currStocks.price/100)?.toFixed(2)} {`(${(currStocks.change)?.toFixed(2)}%)`}</div>
                        }
                    </div>
                    <div className="absolute right-5">
                        <Menu>
                            <MenuButton className="border-[1px] h-[40px] rounded-md flex flex-row justify-center items-center gap-2 pl-2 pr-1"><div className="text-sm">{currChoice}</div><ChevronDown size={20}></ChevronDown></MenuButton>
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
                <div className="h-[280px] w-1/2 m-4 rounded-xl shadow-2xl grid grid-cols-2 bg-white">
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">Average Analyst rating:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.averageAnalystRating}</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">Current Year EPS:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.epsCurrentYear}</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">50 day average:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.fiftyDayAverage}</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">52 week change percent:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.fiftyTwoWeekChangePercent?.toFixed(2)}%</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">Forward PE:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.forwardPE}</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">Regular Market Change:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.regularMarketChange}</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">Regular Market Open:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.regularMarketOpen}</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">Regular Market Volume:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.regularMarketVolume}</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">200 Day Average:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.twoHundredDayAverage}</div></div>
                    <div className="h-[45px] w-[1/2] ml-2 mt-2 flex items-center text-md relative border-b-[1px] "><div className="text-gray-600 ml-2 absolute left-0">Trailing PE:</div><div className="font-bold absolute right-0 mr-3">{stockDetails.trailingPE}</div></div>
                </div>
                <div className="h-[280px] w-1/2 m-4 rounded-xl shadow-2xl bg-white"></div>
            </div>
        </div>
    )
}

export default Details
