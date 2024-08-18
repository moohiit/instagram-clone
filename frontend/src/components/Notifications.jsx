import React from 'react'
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function Notifications() {
  const { liveNotification } = useSelector(store => store.notification);
  return (
    <div className='flex flex-col w-[95%] bg-slate-50 h-screen border shadow-md '>
      <div className='font-bold text-3xl text-gray-600 m-8 '>Notifactions</div>
      <div className='m-8 bg-slate-200 flex flex-col gap-2 mt-3 rounded-lg p-5 border border-gray-300 max-w-screen-sm'>
        {
          liveNotification.length === 0 ? (
            <p>No new notification</p>
          ) : (
            liveNotification?.map((notification) => {
              return (
                <div key={notification.userId} className='flex gap-2 rounded-lg p-2 bg-slate-100 items-center my-1'>
                  <Avatar>
                    <AvatarImage src={notification.userDetails?.profilePicture} />
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                  <p className='text-sm'>
                    <span className='font-bold mr-1'>{notification.userDetails?.username}</span>
                    {
                      notification?.type === "like" && <span className='font-semibold text-sm'>liked your post</span>
                    }
                    {
                      notification?.type === "dislike" && <span className='font-semibold text-sm'>disliked your post</span>
                    }
                    {
                      notification?.type === "comment" && <p>
                        <span className='font-semibold text-sm' >commented on your post</span>
                        <br />
                        <span className='text-gray-300'>{notification?.message}</span>
                      </p>
                    }
                  </p>
                </div>
              )
            })
          )
        }
      </div>
    </div>
  )
}
