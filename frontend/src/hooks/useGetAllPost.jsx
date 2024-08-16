import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  const {posts}=useSelector(store=>store.post)
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const response = await axios.get("/api/v1/post/all", {
          withCredentials:true
        })
        if (response.data.success) {
          dispatch(setPosts(response.data.posts))
          // console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllPost();
  }, [posts])
}

export default useGetAllPost;