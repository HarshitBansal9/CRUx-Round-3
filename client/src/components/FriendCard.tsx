import { getPriceColor } from "./Holding";
interface IPROPS{
    name: string;
    totalUnrealizedGain: number;
    stock1name: string;
    stock1value: number;
    photo: string;
}
function FriendCard({name, totalUnrealizedGain, stock1name, stock1value,photo}:IPROPS) {
  return (
    <div className="bg-white dark:bg-licorice rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-200 dark:bg-jet-black h-32 flex items-center justify-center">
            <img src={photo} alt="profile" className="h-24 w-24 rounded-full" />
        </div>
            <div className="p-4">
                <h3 className="text-lg font-bold dark:text-gray-200 mb-2">{name}</h3>
                <div className="flex items-center mb-2">
                    <span className={`text-gray-700 font-medium dark:text-gray-200 flex flex-row gap-2`}>Total Gain/Loss: <div className={` ${getPriceColor(totalUnrealizedGain)}`}>${totalUnrealizedGain.toFixed(2)}</div></span>
                </div>
                <div className='flex flex-col'>
                    <h2 className="font-bold dark:text-gray-200 ">Top Holding:</h2>
                    <div className="flex flex-row gap-5">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">1.{stock1name}</span>
                        <span className="text-gray-700 font-medium dark:text-gray-200 flex flex-row gap-5">Gain/Loss: <div className={`${getPriceColor(stock1value)}`}>${stock1value.toFixed(2)}</div></span>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default FriendCard