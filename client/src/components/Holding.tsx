import { Link } from "react-router-dom";
interface IPROPS{
    stock_ticker:string;
    shares: number;
    price: number;
}
function Holding({stock_ticker,shares, price}:IPROPS) {
  return (
    <div className="pb-2 pt-2 grid grid-cols-4 items-center">
        <Link to={`../stocks/${stock_ticker}`} className="flex hover:underline items-center gap-2">
            <span>{stock_ticker}</span>
        </Link>
        <div>{shares}</div>
        <div>{price}</div>
        <div className="text-right">${shares*price}</div>
    </div>
  )
}

export default Holding
