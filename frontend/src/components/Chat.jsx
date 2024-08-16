import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import Messages from './Messages';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { Link, useParams } from 'react-router-dom';
import useGetUserProfile from '@/hooks/useGetUserProfile';

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
  const { userProfile } = useSelector(store => store.auth);

  const userId = params?.id;
  if (userId) {
    useGetUserProfile(userId);
  }
  useEffect(() => {
    if (userId) {
      dispatch(setSelectedUser(userProfile));
    }
  },[userId])
  const dispatch = useDispatch();
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);

  const [message, setMessage] = useState("");

  // Function to send a message
  const sendMessageHandler = useCallback(async (recieverId) => {
    try {
      const response = await axios.post(`/api/v1/message/send/${recieverId}`, { message }, {
        headers: { "Content-Type": 'application/json' },
        withCredentials: true,
      });
      if (response.data.success) {
        const newMessages = messages ? [...messages, response.data.newMessage] : [response.data.newMessage];
        dispatch(setMessages(newMessages));
        // toast.success(response.data.message);
        setMessage('');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error sending message');
    }
  }, [dispatch, message, messages]);

  // Clean up function when a user leaves the chat section
  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, [dispatch]);

  const handleUserSelect = useCallback((user) => {
    dispatch(setSelectedUser(user));
  }, [dispatch]);

  // Memoized online status for suggested users
  const memoizedSuggestedUsers = useMemo(() => {
    return suggestedUsers.map(suggestedUser => ({
      ...suggestedUser,
      isOnline: onlineUsers?.includes(suggestedUser?._id),
    }));
  }, [suggestedUsers, onlineUsers]);

  return (
    <div className='flex border border-gray-300 h-screen'>
      <section className='md:w-1/4 my-8'>
        <h1 className='font-bold px-3 mb-2 text-xl text-gray-400'>Your Profile</h1>
        <Link to={`/profile/${user?._id}`}>
          <div className='flex gap-3 items-center p-3 mb-2'>
            <Avatar className='w-8 h-8'>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-sm'>{user?.username}</h1>
              <h3 className='text-gray-600 text-sm'>{user?.bio || 'Bio Here...'}</h3>
            </div>
          </div>
        </Link>
        <hr className='mb-4 border-gray-300' />
        <div className='overflow-y-auto h-[80vh]'>
          {memoizedSuggestedUsers.map(suggestedUser => (
            <SuggestedUserItem
              key={suggestedUser?._id}
              suggestedUser={suggestedUser}
              isOnline={suggestedUser.isOnline}
              onClick={() => handleUserSelect(suggestedUser)}
            />
          ))}
        </div>
      </section>
      {selectedUser ? (
        <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
          <div className='flex gap-3 items-center px-3 py-2 border-b border-b-gray-300 sticky top-0 bg-white'>
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className='flex items-center p-4 border-t border-t-gray-300'>
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              type="text"
              className='flex-1 mr-2 focus-visible:ring-transparent'
              placeholder='Message...'
            />
            <Button onClick={() => sendMessageHandler(selectedUser._id)}>Send</Button>
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
