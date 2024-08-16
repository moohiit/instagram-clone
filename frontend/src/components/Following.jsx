import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setAuthUser } from '@/redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from './ui/button';

function Following() {
  const params = useParams();
  const userId = params.id;
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [followings, setFollowings] = useState(null);

  // get follwers data
  useEffect(() => {
    const getFollowings = async () => {
      try {
        const response = await axios.get(`/api/v1/user/${userId}/following`, {
          withCredentials: true,
        })
        if (response.data.success) {
          setFollowings(response.data.following);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message || "Somthing went Wrong");
      }
    }
    // execute the function
    getFollowings();
  }, [userId])

  // followUnfollowHandler
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
    <div className='flex flex-col w-[95%] bg-slate-50 h-screen min-w-max border items-center shadow-md'>
      <div className='flex items-center justify-center  text-sm'>
        <h1 className='font-bold text-3xl text-gray-600 m-8 '>Following List</h1>
      </div>
      {
        followings && followings.map((following) => {
          const isFollowing = user?.following.includes(following?._id);
          const sameUser = user?._id === following._id
          return (
            <div key={following._id} className='flex items-center justify-between lg:w-1/2 w-[90%] gap-2 my-4 bg-slate-100 p-2 rounded-lg'>
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${following?._id}`}>
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src={following?.profilePicture} />
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className='font-semibold text-sm'>
                    <Link to={`/profile/${following?._id}`}>
                      {following?.username}
                    </Link>
                  </h1>
                  <h3 className='text-gray-600 text-sm'>
                    {following?.bio || "Bio Here..."}
                  </h3>
                </div>
              </div>
              {
                sameUser ? (
                  <span className='font-bold w-20 text-center bg-slate-50 p-2 rounded-lg'>You</span>
                ) : (
                  <Button
                    variant='secondary'
                      onClick={() => followUnfollowHandler(following._id)}
                    className={`font-bold cursor-pointer w-20 ${isFollowing ? 'text-[#f83b3b] hover:text-[#f53131]' : 'text-[#3BADF8] hover:text-[#31bdf5]'} `}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )
              }
            </div>
          );
        })
      }
    </div>
  )
}

export default Following
