import { Link } from "react-router-dom";
interface IPROPS{
    date:string;
    stock_ticker: string;
    amount: number;
    action: string;
}
function Transaction({date,stock_ticker, amount, action}:IPROPS) {
  return (
    <div>
      <div className="grid grid-cols-4 items-center">
            <div>{date.slice(0,10)}</div>
            <Link to={`../stocks/${stock_ticker}`} className="hover:underline">{stock_ticker}</Link>
            <div>{action}</div>
            <div className="text-right">${amount}</div>
        </div>
    </div>
  )
}

export default Transaction
