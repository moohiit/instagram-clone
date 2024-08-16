import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user]);
  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const response = await axios.post('/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
        navigate('/');
        toast.success(response.data.message);
        setInput({
          email: "",
          password: ""
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form autoComplete='off' onSubmit={loginHandler} className='flex flex-col shadow-lg gap-5 p-8 '>
        <div className='mt-4'>
          <h1 className='text-center font-bold text-xl' >Logo</h1>
          <p className='text-sm text-center'>Login to see photos and videos from your friends</p>
        </div>
        <div>
          <Label className='py-2 font-medium'>Email</Label>
          <Input
            type='email'
            name='email'
            value={input.email}
            onChange={handleInput}
            className='focus-visible:ring-transparent my-2'
          />
        </div>
        <div>
          <Label className='py-2 font-medium'>Password</Label>
          <Input
            type='password'
            name='password'
            value={input.password}
            onChange={handleInput}
            className='focus-visible:ring-transparent my-2'
          />
        </div>
        {
          loading ? (<Button disabled  >
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Loading...
          </Button>) : (<Button type="submit" >Login</Button>)
        }
        
        <span className='text-center'>Don't have an account? <Link to='/signup' className='text-blue-500'>Signup</Link>
        </span>
      </form>
    </div>
  )
}

export default Login
