import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'


const Signup = () => {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user]);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const handleInput = (e) => {
    setInput({...input,[e.target.name]:e.target.value})
  }

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const response = await axios.post('/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      if (response.data.success) {
        navigate('/login');
        toast.success(response.data.message);
        setInput({
          username: "",
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
      <form autoComplete='off' onSubmit={signupHandler} className='flex flex-col shadow-lg gap-5 p-8 '>
        <div className='mt-4'>
          <h1 className='text-center font-bold text-xl' >Logo</h1>
          <p className='text-sm text-center'>Signup to see photos and videos from your friends</p>
        </div>
        <div>
          <Label className='py-2 font-medium'>Username</Label>
          <Input
            type='text'
            name='username'
            value={input.username}
            onChange={handleInput}
            className='focus-visible:ring-transparent my-2'
          />
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
          </Button>) : (<Button type="submit" >Submit</Button>)
        }
        
        <span className='text-center'>Already have an account? <Link to='/login' className='text-blue-500'>Login</Link>
        </span>
      </form>
    </div>
  )
}

export default Signup
