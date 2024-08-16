import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.auth)
  useEffect(() => { 
    const fetchAllMessage = async () => {
      try {
        const response = await axios.get(`/api/v1/message/all/${selectedUser?._id}`, {
          withCredentials: true
        })
        if (response.data.success) {
          console.log(response.data);
          dispatch(setMessages(response.data.messages))
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
    fetchAllMessage();
  }, [selectedUser])
}

export default useGetAllMessage;