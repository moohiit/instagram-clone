import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  return (
    <div className='flex flex-col flex-1 overflow-y-auto p-4'>
      <div className='flex justify-center mb-4'>
        <div className='flex flex-col items-center'>
          <Avatar className='h-16 w-16'>
            <AvatarImage src={selectedUser?.profilePicture} />
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
          <span className='text-lg font-semibold'>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className='h-8 my-2' variant='secondary'>
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {messages?.map((msg) => (
          <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg max-w-[80%] break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
