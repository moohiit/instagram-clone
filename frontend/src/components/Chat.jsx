import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import Messages from './Messages';
import { Button } from './ui/button';
import { MessageCircleCode, MoreHorizontalIcon } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { Link, useParams } from 'react-router-dom';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

// Memoized suggested user item to prevent unnecessary re-renders
const SuggestedUserItem = React.memo(({ suggestedUser, isOnline, onClick }) => (
  <div onClick={onClick} className='flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer'>
    <Avatar className='w-14 h-14'>
      <AvatarImage src={suggestedUser?.profilePicture} />
      <AvatarFallback>MP</AvatarFallback>
    </Avatar>
    <div className='flex flex-col'>
      <span className='font-medium'>{suggestedUser?.username}</span>
      <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  </div>
));

function Chat() {
  const params = useParams();
  const dispatch = useDispatch();
  const { user, followings, selectedUser, userProfile } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);

  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  // Fetch user profile if ID is present in the params
  const userId = params?.id;
  if (userId) {
    useGetUserProfile(userId);
  }
  console.log("Following:")
  console.log(followings);
  // Set selected user profile when user ID changes
  useEffect(() => {
    if (userId) {
      dispatch(setSelectedUser(userProfile));
    }
  }, [dispatch, userId, userProfile]);

  // Send message function
  const sendMessageHandler = useCallback(async (recieverId) => {
    try {
      const response = await axios.post(`/api/v1/message/send/${recieverId}`, { message }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (response.data.success) {
        const newMessages = messages ? [...messages, response.data.newMessage] : [response.data.newMessage];
        dispatch(setMessages(newMessages));
        setMessage('');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error sending message');
    }
  }, [dispatch, message, messages]);

  // Clean up when leaving the chat section
  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, [dispatch]);

  // Handle user selection
  const handleUserSelect = useCallback((usr) => {
    dispatch(setSelectedUser(usr));
    setOpen(false);
  }, [dispatch]);

  // Memoize the followings with their online status
  const memoizedFollowings = useMemo(() => {
    return followings?.map((followingUser) => ({
      ...followingUser,
      isOnline: onlineUsers?.includes(followingUser?._id),
    }));
  }, [followings, onlineUsers]);

  return (
    <div className='flex flex-col border border-gray-300 h-screen'>
      <div className='w-full bg-gray-300 flex px-4 justify-between'>
        <span onClick={() => setOpen(true)} className='font-bold text-gray-500 p-2 cursor-pointer'>Freinds List</span>
        <Dialog open={open} >
          <DialogTrigger onClick={()=>setOpen(true)} >
            <MoreHorizontalIcon />
          </DialogTrigger>
          <DialogContent onInteractOutside={() => setOpen(false)}>
            <DialogTitle className='font-bold px-3 text-xl text-gray-400'>Friends</DialogTitle>
            <section className='w-full'>
              <hr className='mb-4 border-gray-300' />
              <div className='overflow-y-auto h-max'>
                {memoizedFollowings?.map((followingUser) => (
                  <SuggestedUserItem
                    key={followingUser?._id}
                    suggestedUser={followingUser}
                    isOnline={followingUser.isOnline}
                    onClick={() => handleUserSelect(followingUser)}
                  />
                ))}
              </div>
            </section>
          </DialogContent>
        </Dialog>
      </div>
      {selectedUser ? (
        <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
          <Messages selectedUser={selectedUser} />
          <div className='flex items-center p-4 border-t border-t-gray-300'>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value.trim())}
              type='text'
              className='flex-1 mr-2 focus-visible:ring-transparent'
              placeholder='Message...'
            />
            {message && <Button onClick={() => sendMessageHandler(selectedUser._id)}>Send</Button> }
          </div>
        </section>
      ) : (
        <div className='flex flex-col border-l border-l-gray-300 w-full items-center justify-center mx-auto'>
          <MessageCircleCode className='w-32 h-32 my-4' />
          <h1>Your Messages</h1>
          <span>Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
}

export default Chat;
