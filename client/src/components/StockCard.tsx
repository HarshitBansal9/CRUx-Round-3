interface IPROPS{
    company:string;
    name: string;
    price: number;
    change: number;
}
function StockCard({company,name, price, change}:IPROPS) {
  return (
    <div className="bg-white flex flex-col rounded-lg border-[1px] border-gray-300 w-[300px] h-[300px]">
      <div className="h-[80px] w-full flex items-center">
        <div className="ml-4 w-[200px]">
            <div className="text-lg">{company}</div>
            <div className="text-gray-400 text-sm">{name}</div>
        </div>
        {
        change < 0 ? 
        <div className="text-red-400 ml-4">{change.toFixed(1)}%</div>:
        <div className="text-green-400 ml-4">+{change.toFixed(1)}%</div>
        }
      </div>
      <div className="h-[140px] w-full flex items-center">
        <div className="ml-4 w-[200px]">
            <div className="text-2xl text-black font-bold">${price}</div>
            <div className="text-gray-500 text-sm">Last Traded Price</div>
        </div>
      </div>
      <div className="h-[80px] w-full flex items-center">
        <div className="h-[30px] w-[80px] border-[1px] flex ml-6 border-gray-400 mb-6 rounded-md hover:cursor-pointer items-center justify-center text-gray-500">Trade</div>
      </div>
    </div>
  ) 
}

export default StockCard
