interface IPROPS{
    company:string;
    name: string;
    price: number;
    change: number;
}
function StockCard({company,name, price, change}:IPROPS) {
  return (
    <div className="bg-white dark:bg-licorice dark:border-none flex flex-col rounded-lg border-[1px] shadow-xl dark:shadow-2xl border-gray-300 xl:[600px] w-[350px] lg:w-[400px] h-[350px]">
      <div className="h-[90px] w-full flex items-center">
        <div className="lg:ml-8 ml-4 w-[240px]">
            <div className="text-xl dark:text-gray-200">{company}</div>
            <div className="text-gray-400 text-md">{name}</div>
        </div>
        {
        change < 0 ? 
        <div className="text-red-400 text-lg lg:ml-8 ml-4">{change.toFixed(1)}%</div>:
        <div className="text-green-400 text-lg lg:ml-8 ml-4">+{change.toFixed(1)}%</div>
        }
      </div>
      <div className="h-[170px] w-full flex items-center">
        <div className=" lg:ml-8 ml-4 w-[200px]">
            <div className="text-3xl text-black dark:text-gray-200 font-bold">${price.toFixed(2)}</div>
            <div className="text-gray-500 dark:text-gray-400 text-md">Last Traded Price</div>
        </div>
      </div>
      <div className="h-[90px] w-full flex items-center">
        <div className="h-[40px] w-[100px] border-[1px] flex ml-6 border-gray-400 mb-6 rounded-md hover:cursor-pointer dark:bg-gray-200 dark:text-black font-bold items-center justify-center text-gray-500">Trade</div>
      </div>
    </div>
  ) 
}

export default StockCard
