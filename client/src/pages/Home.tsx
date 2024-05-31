import {Link} from 'react-router-dom';
function Home({user}:any) {
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
      
    </div>
  )
}

export default Home
