import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectContent } from './ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { setAuthUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

function EditProfile() {
  const { user } = useSelector(store => store.auth);
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender
  });
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePicture: file });
  }
  const selectChangeHandler = (value) => {
    setInput({...input,gender:value})
  }
  const editProfileHandler = async () => {
    // console.log(input);
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("bio", input.bio);
      formData.append("gender", input.gender);
      if (input.profilePicture) {
        formData.append("profilePicture", input.profilePicture);
      }
      console.log(formData);
      const response = await axios.post(`/api/v1/user/profile/edit`, formData, {
        headers: {
          "Content-Type":'multipart/form-data'
        },
        withCredentials:true
      })
      if (response.data.success) {
        const updatedUserData = {
          ...user,
          bio: response.data.user.bio,
          gender: response.data.user.gender,
          profilePicture:response.data.user.profilePicture
        }
        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user?._id}`)
        toast.success(response.data.message);
      }      
    } catch (error) { 
      console.log(error);
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='flex flex-col items-center max-w-2xl my-10'>
      <section className='flex flex-col gap-6 my-8 w-full'>
        <h1 className='font-bold text-xl'>Edit Profile</h1>
        <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
          <div className='flex items-center gap-4'>
            <Link to={`/profile/${user?._id}`}>
              <Avatar className='w-12 h-12'>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>MP</AvatarFallback>
              </Avatar>
            </Link>
            <div className=''>
              <h1 className='font-bold text-sm'>
                <Link to={`/profile/${user?._id}`}>
                  {user?.username}
                </Link>
              </h1>
              <h3 className='text-gray-600 '>{user?.bio || "Boi Here..."} </h3>
            </div>
          </div>
          <input onChange={(e)=>fileChangeHandler(e)} type="file" className='hidden' ref={fileRef} />
          <Button className='bg-[#0095F6] hover:bg-[#0277c5]' onClick={() => fileRef.current.click()}>Change Photo</Button>
        </div>
        <div>
          <h1 className='font-bold '>Bio</h1>
          <Textarea value={input.bio} onChange={(e)=>setInput({...input,bio:e.target.value})} className='focus-visible:ring-transparent' name={"Bio"} />
        </div>
        <div>
          <h1 className='font-bold mb-2'>Gender</h1>
          <Select defaultValue={input.gender} onValueChange={(value)=>selectChangeHandler(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Genders</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex justify-end'>
          {
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait...
              </Button>
            ): (
              <Button onClick={editProfileHandler} className='bg-[#0095F6] hover:bg-[#0277c5]'>Submit</Button>
            )
          }
        </div>
      </section>
    </div>
  )
}

export default EditProfile
