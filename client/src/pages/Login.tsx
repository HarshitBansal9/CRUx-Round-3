import config from "../config";

function Login() {
  const google = () => {
    window.open(`${config.BACKEND_URL}/auth/google`,"_self"); 
  }
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-custom-background">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Welcome to Finance App</h1>
          <p className="mt-2 text-gray-500 text-lg dark:text-gray-400">Sign in to access your financial dashboard.</p>
        </div>
        <button
          onClick={google}
          className="flex w-full items-center justify-center dark:bg-licorice gap-2 rounded-md border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:focus:ring-gray-300">
          <ChromeIcon className="h-6 w-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" x2="12" y1="8" y2="8" />
        <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
        <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
      </svg>
    )
  }

export default Login
