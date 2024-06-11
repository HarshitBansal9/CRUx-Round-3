import { useEffect, useState } from "react";
import axios from "axios";
import Holding, { getPriceColor } from "../components/Holding";
import { ListOrdered } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems,Transition } from '@headlessui/react'
import { ResponsivePie } from '@nivo/pie'
import config from "../config";

function Portfolio() {
    const [availableAmt,setAvailableAmt] = useState<number>(0);
    const [addAmt,setAddAmt] = useState<number>(0);
    const [holdings,setHoldings] = useState<any>([]);
    const [sort,setSort] = useState<string>("currentPrice");
    const [currStatus,setCurrStatus] = useState<string>("");
    const [sectorData,setSectorData] = useState<any>([]);
    const [totalValue,setTotalValue] = useState<number>(0);
    useEffect(()=>{
        async function getAmt(){
            const response  = await axios.get(`${config.BACKEND_URL}/portfolio/available_amount`,{withCredentials:true});
            setAvailableAmt(response.data.available_amount);
        }
        getAmt();
        async function getHoldings(){
            const response = await axios.get(`${config.BACKEND_URL}/portfolio/get_holdings`,{withCredentials:true});
            let sum1 = 0;
            for (let i = 0;i<response.data.length;i++){
                sum1+=Number(response.data[i].value);
            }
            setTotalValue(sum1);
            let data:any = [];
            for(let i = 0;i<response.data.length;i++){
                let flag = false;
                for (let j = 0;j<data.length;j++){
                    if (data[j].id===response.data[i].industry){
                        flag = true;
                        data[j].value+=Number(response.data[i].value);
                        break;
                    }
                }
                if (flag) {
                    continue
                };
                data.push({id:response.data[i].industry,value:Number(response.data[i].value)});
            }
            data = data.map((x:any)=>{return {id:x.id,label:x.id,value:x.value.toFixed(2)}});
            setSectorData(data);
            setHoldings(response.data);
        }
        getHoldings();
        async function getStatus(){
            const response = await axios.get(`${config.BACKEND_URL}/portfolio/get_status`,{withCredentials:true});
            setCurrStatus(response.data.status);
        }
        getStatus();
        async function getOtherUserData() {
            const response = await axios.get(`${config.BACKEND_URL}/portfolio/get_other_user_data`,{withCredentials:true});
            console.log(response.data);      
        };
        getOtherUserData();
    },[]);
    const unrealizedGainSum = holdings.reduce((acc:any,holding:any)=>acc+holding.unrealizedGain,0).toFixed(2);
    return (
        <div>
            <main className="flex-1 bg-gray-100 p-4 md:p-8 dark:bg-custom-background">
                <div className="container max-w-6xl dark:bg-licorice mx-auto grid gap-8">
                <div className="grid gap-4">
                    <div className="bg-white dark:bg-licorice rounded-lg shadow-sm p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg dark:text-gray-200 font-semibold">Portfolio</h2>
                        <div onClick = { async ()=>{
                            let status = currStatus;
                            if (currStatus==="private"){
                                status = "public";
                                setCurrStatus("public");
                            } else {
                                status = "private";
                                setCurrStatus("private");
                            }
                            await axios.get(`${config.BACKEND_URL}/portfolio/change_status`,{params:{status:status},withCredentials:true});
                        }} className="border-[1px] p-2 rounded-lg dark:bg-gray-400 dark:border-none hover:bg-white bg-gray-100 hover:cursor-pointer">Change Status</div>        
                        <div>
                            <Menu>
                                <MenuButton className="border-[1px] dark:bg-gray-400 dark:border-none w-[100px] h-[40px] rounded-md flex flex-row justify-evenly items-center"><ListOrdered size={18}></ListOrdered><div className="text-sm">Sort by</div></MenuButton>
                                <Transition enter="transition ease-out duration-75" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                    <MenuItems className="h-[162px] dark:bg-gray-200 w-[100px] bg-white border-[1px] hover:cursor-pointer" anchor="bottom">
                                        <MenuItem>
                                        <div onClick={()=>{setSort("currentPrice")}} className="hover:bg-gray-200">
                                        <a className="flex justify-center dark:hover:bg-white items-center p-2">
                                            Default
                                        </a>
                                        </div>
                                        </MenuItem>
                                        <MenuItem>
                                        <div onClick={()=>{setSort("currentPrice")}} className="hover:bg-gray-200">
                                        <a className="flex justify-center dark:hover:bg-white items-center p-2">
                                            Price
                                        </a>
                                        </div>
                                        </MenuItem>
                                        <MenuItem>
                                        <div onClick={()=>{setSort("value")}} className="hover:bg-gray-200">
                                        <a className="flex justify-center dark:hover:bg-white items-center p-2">
                                            Value
                                        </a>
                                        </div>
                                        </MenuItem>
                                        <MenuItem>
                                        <div onClick={()=>{setSort("number_of_shares")}} className="hover:bg-gray-200">
                                        <a className="flex justify-center dark:hover:bg-white items-center p-2">
                                            Shares 
                                        </a>
                                        </div>
                                        </MenuItem>
                                    </MenuItems>
                                </Transition>
                            </Menu>
                        </div>
                        <div className="w-[300px] h-full items-center flex-row flex justify-evenly">
                            <input onChange={(e)=>{
                                if (parseInt(e.target.value) < 0){
                                    alert("Please enter a positive number");
                                    return;
                                }
                                setAddAmt(parseInt(e.target.value))}} type="Number" min="0" placeholder="Add amount..." className="w-[150px] dark:bg-gray-200 absol max-w-xs rounded-lg border-gray-300 bg-gray-100 px-4 py-2 text-sm border-[1px] focus:border-gray-500 focus:outline-none "/>
                            <div onClick={async ()=>{
                                let x = Number(availableAmt)+Number(addAmt);
                                setAvailableAmt(x);
                                await axios.get(`${config.BACKEND_URL}/portfolio/add_amount`,{withCredentials:true,params:{amount:addAmt}});
                            }} className="border-[1px] w-[60px] flex justify-center hover:cursor-pointer hover:bg-white dark:bg-gray-200 items-center rounded-lg bg-gray-100 h-[35px]">Add</div> 
                        </div>
                        <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-200">Total Value</span>
                        <div className="text-lg font-bold dark:text-white">${totalValue.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-licorice text-gray-500">
                            <tr>
                                <th className="py-3 px-4 dark:text-gray-200">Stock</th>
                                <th className="py-3 px-4 dark:text-gray-200">Shares</th>
                                <th className="py-3 px-4 dark:text-gray-200">Price</th>
                                <th className="py-3 px-4 dark:text-gray-200">Value</th>
                                <th className="py-3  dark:text-gray-200">Unrealized Gain/Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.sort((a:any,b:any)=>Number(b[sort])-Number(a[sort])).map((holding:any)=><Holding key={holding.stock_ticker} {...holding} />)}
                        </tbody>
                        </table>
                    </div>
                    </div>
                    </div>
                </div>
                <div className="bg-white max-w-6xl dark:bg-licorice mx-auto mt-10 rounded-lg shadow-sm p-4 md:p-6 grid gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg dark:text-gray-200 font-semibold">Portfolio Summary</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Total Value</div>
                            <div className="text-lg font-bold">${totalValue.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Unrealized Gain/Loss  </div>
                            <div className={`text-lg font-bold ${getPriceColor(unrealizedGainSum)}`}>${unrealizedGainSum}</div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Cash Balance</div>
                            <div className="text-lg font-bold">${availableAmt}</div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-500">Current Status</div>
                            <div className="text-lg font-bold">{currStatus}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 max-w-6xl dark:bg-custom-background mx-auto mt-10 rounded-lggrid gap-4">
                    <div className="w-1/2 bg-white dark:bg-licorice rounded-lg p-4 md:p-6">
                        <div className="font-bold text-xl dark:text-gray-200">Sector Wise Holdings</div>
                        <div className="h-[300px]">
                        <ResponsivePie
                                
                                data={sectorData}
                                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                activeOuterRadiusOffset={8}
                                borderWidth={1}
                                borderColor={{
                                    from: 'color',
                                    modifiers: [
                                        [
                                            'darker',
                                            0.2
                                        ]
                                    ]
                                }}
                                arcLinkLabelsSkipAngle={10}
                                arcLinkLabelsTextColor="#333333"
                                arcLinkLabelsThickness={2}
                                arcLinkLabelsColor={{ from: 'color' }}
                                arcLabelsSkipAngle={10}
                                arcLabelsTextColor={{
                                    from: 'color',
                                    modifiers: [
                                        [
                                            'darker',
                                            2
                                        ]
                                    ]
                                }}
                                defs={[
                                    {
                                        id: 'dots',
                                        type: 'patternDots',
                                        background: 'inherit',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                        size: 4,
                                        padding: 1,
                                        stagger: true
                                    },
                                    {
                                        id: 'lines',
                                        type: 'patternLines',
                                        background: 'inherit',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                        rotation: -45,
                                        lineWidth: 6,
                                        spacing: 10
                                    }
                                ]}
                                theme={{
                                    "text":{"fill":"#919191","outlineColor":"transparent"}
                                }}
                                fill={[
                                    {
                                        match: {
                                            id: 'ruby'
                                        },
                                        id: 'dots'
                                    },
                                    {
                                        match: {
                                            id: 'c'
                                        },
                                        id: 'dots'
                                    },
                                    {
                                        match: {
                                            id: 'go'
                                        },
                                        id: 'dots'
                                    },
                                    {
                                        match: {
                                            id: 'python'
                                        },
                                        id: 'dots'
                                    },
                                    {
                                        match: {
                                            id: 'scala'
                                        },
                                        id: 'lines'
                                    },
                                    {
                                        match: {
                                            id: 'lisp'
                                        },
                                        id: 'lines'
                                    },
                                    {
                                        match: {
                                            id: 'elixir'
                                        },
                                        id: 'lines'
                                    },
                                    {
                                        match: {
                                            id: 'javascript'
                                        },
                                        id: 'lines'
                                    }
                                ]}
                                legends={[
                                    {
                                        anchor: 'bottom',
                                        direction: 'row',
                                        justify: false,
                                        translateX: 0,
                                        translateY: 56,
                                        itemsSpacing: 0,
                                        itemWidth: 100,
                                        itemHeight: 18,
                                        itemTextColor: '#999',
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 1,
                                        symbolSize: 18,
                                        symbolShape: 'circle',
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemTextColor: '#000'
                                                }
                                            }
                                        ]
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Portfolio
