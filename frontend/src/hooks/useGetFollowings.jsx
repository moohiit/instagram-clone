import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setFollowings } from '@/redux/authSlice';
import { toast } from 'sonner';

const useGetFollowings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  // console.log(user);

  useEffect(() => {
    const getFollowings = async () => {
      try {
        const response = await axios.get(`/api/v1/user/${user?._id}/following`, {
          withCredentials: true,
        });
        if (response.data.success) {
          // console.log(response.data.following)
          // toast.success(response.data.message)
          dispatch(setFollowings(response.data.following));
        }
      } catch (error) {
        // console.log("Something went wrong")
        console.log(error);
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    };

    if (user?._id) {
      getFollowings();
    }
  }, [dispatch, user]);
};

export default useGetFollowings;
