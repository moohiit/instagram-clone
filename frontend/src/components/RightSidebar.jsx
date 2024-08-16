import React from 'react'
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';


function RightSidebar() {
  const { user } = useSelector(store => store.auth);
  return (
    <div className='w-fit my-10 mx-2 p-2'>
      <div className='flex items-center gap-2 mb-4'> 
        <Link to={`/profile/${user?._id}`}>
          <Avatar className='w-8 h-8'>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
        </Link>
        <div className=''>
          <h1 className='font-semibold text-sm'>
            <Link to={`/profile/${user?._id}`}>
            {user?.username}
            </Link>
          </h1>
          <h3 className='text-gray-600 text-sm'>{user?.bio || "Boi Here..."} </h3>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar;