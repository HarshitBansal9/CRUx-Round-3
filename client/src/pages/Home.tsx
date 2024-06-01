import {Link} from 'react-router-dom';
import StockCard from '../components/StockCard';
import { useEffect,useState } from 'react';
import axios from 'axios';
function Home({user}:any) {
  const [stocks,setStocks] = useState([]);
  useEffect(()=>{
    async function getStocks(){
      const response = await axios.get("http://localhost:5000/stock/getstocks",{withCredentials:true});
      setStocks(response.data.slice(0,3));
    }
    getStocks();
  },[])
  return (
    <div>
      {!user ? (
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 space-y-6 lg:space-y-10">
            <div className="grid max-w-[1000px] mx-auto px-4">
              <div>
                <h1 className="lg:leading-tighter text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[4rem] 2xl:text-[4.25rem]">
                  Invest in the Future
                </h1>
                <p className="mx-auto max-w-[700px] ml-[0px] text-gray-500 md:text-xl xl:text-2xl">
                  Discover the latest stock trends and build your portfolio with Stockify.
                </p>
                <div className="space-x-4 mt-6">
                  <Link
                    to="login"
                    className=" h-[50px]  w-[100px] inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="login"
                    className="inline-flex h-[50px] w-[100px]  items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-lg font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 "
                  >
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div></div>
      )
      }
      <section className="w-full flex justify-center items-center h-[250px] py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">
                Featured Stocks
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Top Performing Stocks</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Discover the latest stock trends and add them to your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className='w-full flex items-center flex-row justify-evenly h-[400px]'>
        {
          stocks.map((stock:any)=>{
            return <StockCard company={stock.company} name={stock.name} price={stock.price} change={stock.change}></StockCard>
          })
        }
      </div>
    </div>
  )
}

export default Home
