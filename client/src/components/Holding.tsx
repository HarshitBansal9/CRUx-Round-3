import { Link } from "react-router-dom";
interface IPROPS{
    stock_ticker:string;
    number_of_shares: number;
    currentPrice: number;
    value:number;
    unrealizedGain:number;
}
export function getPriceColor(change:number){
  return change > 0 ? 'text-green-500' : 'text-red-500';
}
function Holding({stock_ticker,number_of_shares, currentPrice,value,unrealizedGain}:IPROPS) {
  return (
    <tr className="border-b">
     <td className="py-4 px-4 hover:underline font-medium dark:text-gray-200"> <Link to={`../stocks/${stock_ticker}`}>{stock_ticker}</Link></td>
      <td className="py-4 px-4 dark:text-gray-200">{number_of_shares}</td>
      <td className="py-4 px-4 dark:text-gray-200">${currentPrice}</td>
      <td className="py-4 px-4 dark:text-gray-200">${(value).toFixed(2)}</td>
      <td className={`py-4 font-bold px-4 ${getPriceColor(unrealizedGain)}`}>${(unrealizedGain).toFixed(2)}</td>
    </tr>
  )
}

export default Holding
