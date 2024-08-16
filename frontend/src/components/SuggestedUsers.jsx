import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner'; // Using sonner for toast notifications
import axios from 'axios';
import { setAuthUser } from '@/redux/authSlice'; // Assuming your authSlice
import { Button } from './ui/button';

function SuggestedUsers() {
  const { suggestedUsers, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
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
    <>
      <div className='flex items-center justify-between text-sm'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>
      {
        suggestedUsers.map((suggestedUser) => {
          const isFollowing = user?.following.includes(suggestedUser?._id);
          return (
            <div key={suggestedUser._id} className='flex items-center gap-2 my-4'>
              <div className='flex items-center gap-2 w-[80%]'>
                <Link to={`/profile/${suggestedUser?._id}`}>
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className='font-semibold text-sm'>
                    <Link to={`/profile/${suggestedUser?._id}`}>
                      {suggestedUser?.username}
                    </Link>
                  </h1>
                  <h3 className='text-gray-600 text-sm'>
                    {suggestedUser?.bio || "Bio Here..."}
                  </h3>
                </div>
              </div>
              <Button
                variant='secondary'
                onClick={() => followUnfollowHandler(suggestedUser._id)}
                className={`bg-gray-200 hover:bg-blue-200 w-24 font-bold cursor-pointer ${isFollowing ? 'text-[#f83b3b] hover:text-[#f53131]' : 'text-[#3BADF8] hover:text-[#31bdf5]'} `}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          );
        })
      }
    </>
  )
}

export default SuggestedUsers;
