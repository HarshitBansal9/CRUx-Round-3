interface IPROPS{
    company:string;
    name: string;
    price: number;
    change: number;
}
function StockCard({company,name, price, change}:IPROPS) {
  return (
    <div className="bg-white flex flex-col rounded-lg border-[1px] shadow-xl border-gray-300 w-[350px] h-[350px]">
      <div className="h-[90px] w-full flex items-center">
        <div className="ml-4 w-[240px]">
            <div className="text-xl">{company}</div>
            <div className="text-gray-400 text-md">{name}</div>
        </div>
        {
        change < 0 ? 
        <div className="text-red-400 text-lg ml-4">{change.toFixed(1)}%</div>:
        <div className="text-green-400 text-lg ml-4">+{change.toFixed(1)}%</div>
        }
      </div>
      <div className="h-[170px] w-full flex items-center">
        <div className="ml-4 w-[200px]">
            <div className="text-3xl text-black font-bold">${price.toFixed(2)}</div>
            <div className="text-gray-500 text-md">Last Traded Price</div>
        </div>
      </div>
      <div className="h-[90px] w-full flex items-center">
        <div className="h-[40px] w-[100px] border-[1px] flex ml-6 border-gray-400 mb-6 rounded-md hover:cursor-pointer items-center justify-center text-gray-500">Trade</div>
      </div>
    </div>
  ) 
}

export default StockCard
