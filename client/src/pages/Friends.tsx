import { useEffect,useState } from 'react'
import axios from 'axios'
import FriendCard from '../components/FriendCard';
import config from '../config';

function Friends() {
    const [userData,setUserData] = useState([]);
    useEffect(()=>{
        async function getOtherUserData() {
            const response = await axios.get(`${config.BACKEND_URL}/get_other_user_data`,{withCredentials:true});
            console.log(response.data);
            setUserData(response.data);     
        };
        getOtherUserData();
    },[])
  return (
    <main className="flex-1 bg-gray-100 dark:bg-custom-background h-screen py-8 px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userData.map((user:any)=>{return <FriendCard key={user.id} photo={user.photo} name={user.user} totalUnrealizedGain={user.totalUnrealizedGain} stock1name={user.topTwoStocks[0].stock_ticker} stock1value={user.topTwoStocks[0].unrealizedGain} stock2name={user.topTwoStocks[1].stock_ticker} stock2value={user.topTwoStocks[1].unrealizedGain}></FriendCard>})}
        </div>
    </main>
  )
}

export default Friends