import { setSuggestedusers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  const { suggestedUsers } = useSelector(store => store.auth);
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get("/api/v1/user/suggested", {
          withCredentials: true
        })
        if (response.data.success) {
          dispatch(setSuggestedusers(response.data.users))
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchSuggestedUsers();
  }, [suggestedUsers])
}

export default useGetSuggestedUsers;