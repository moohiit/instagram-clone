import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'

function CreatePost({ open, setOpen }) {
  const inputref = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const {posts} = useSelector(store => store.post);
  const dispatch = useDispatch();
  //File handler function
  const fileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }
  //createPostHandler function
  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) {
      formData.append("image", file);
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/v1/post/addpost", formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        },
        withCredentials: true
      });
      if (response.data.success) {
        dispatch(setPosts([response.data.post, ...posts]));
        console.log(response.data.success);
        toast.success(response.data.message);
        setFile("");
        setCaption("");
        setImagePreview("")
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogTitle className='font-semibold '>Create new Post</DialogTitle>
        <DialogDescription className='hidden'>Create new post</DialogDescription>
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt='Image' />
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username} </h1>
          </div>
        </div>
        <Textarea className='focus-visible:ring-transparent border-none' placeholder='Write a caption'
          value={caption}
          onChange={(e)=>setCaption(e.target.value)}
        />
        {
          imagePreview && (
            <div className='w-full h-64 justify-center flex items-center '>
              <img className='object-cover h-full w-full rounded-md' src={imagePreview} alt="Image_Preview" />
            </div>
          )
        }
        <input
          onChange={fileHandler}
          ref={inputref}
          type="file" className='hidden' />
        <Button onClick={() => inputref.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#047fd1]'>Select Photo</Button>
        {imagePreview && (
          loading ? (<Button>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait...
          </Button>) : (
            <Button type='submit'
              onClick={createPostHandler}
              className='w-full'>Post
              </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
