import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import SuggestedUsers from './SuggestedUsers'
import { toast } from 'sonner'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

function Search() {
  const [username, setUsername] = useState("")
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useSelector(store => store.auth);
  const isFollowing = user?.following.includes(userProfile?._id);
  const dispatch = useDispatch();
  //Search handler
  const searchHandler = async () => {
    try {
      const response = await axios.get(`/api/v1/user/search/${username}`, {
        withCredentials: true
      })
      if (response?.data.success) {
        if (response?.data.user) {
          setUserProfile(response?.data.user);
        } else {
          toast.success("User doesn't exist")
        }
        setUsername("");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  }
  //followUnfollowHandler
  const followUnfollowHandler = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/user/followorunfollow/${userId}`, {
        withCredentials: true
      });
      if (response.data.success) {
        const newFollowingData = response.data.type === 'follow'
          ? [...user?.following, userId]
          : user?.following.filter(id => id !== userId);
        // Dispatch the updated user state
        dispatch(setAuthUser({ ...user, following: newFollowingData }));
        // Show success toast
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      // Show error toast
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  }
  return (
    <div className='flex flex-col w-[95%] bg-slate-50 min-h-max min-w-max border shadow-md items-center '>
      <h1 className='font-bold text-3xl text-gray-600 m-8 '>Search bar</h1>
      <div className='flex gap-4 m-8 mt-3 lg:w-full justify-center'>
        <Input onChange={(e) => setUsername(e.target.value)} value={username} className=' focus-visible:ring-transparent flex-grow gap-2  rounded-lg p-6 border border-gray-300 max-w-screen-sm' placeholder='search username' />
        {
          username && <Button onClick={searchHandler} className='p-6'>Search</Button>
        }
      </div>
      <div className='lg:grid lg:grid-cols-2 flex flex-col mb-4 gap-4 w-[80%]'>
        <div className='flex justify-start items-start bg-slate-100 px-4 rounded-md'>
          {
            userProfile ? (<div key={userProfile._id} className='flex items-center gap-2 my-4'>
              <div className='flex items-center gap-2 w-[80%]'>
                <Link to={`/profile/${userProfile?._id}`}>
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src={userProfile?.profilePicture} />
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                </Link>
                <div className=''>
                  <h1 className='font-semibold text-sm'>
                    <Link to={`/profile/${userProfile?._id}`}>
                      {userProfile?.username}
                    </Link>
                  </h1>
                  <h3 className='text-gray-600 text-sm'>{userProfile?.bio || "Boi Here..."} </h3>
                </div>
              </div>
              <Button
                variant='secondary'
                onClick={() => followUnfollowHandler(userProfile?._id)}
                className={` bg-gray-200 hover:bg-blue-200 ml-1 font-bold cursor-pointer ${isFollowing ? 'text-[#f83b3b] hover:text-[#f53131]' : 'text-[#3BADF8] hover:text-[#31bdf5]'} `}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>) : (
              <div className='p-4 text-center mt-4 text-gray-500 font-semibold'>
                Your search results will be here...
              </div>
            )
          }
        </div>
        <div><SuggestedUsers /></div>
      </div>
    </div>
  )
}

export default Search
