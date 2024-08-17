import RightSidebar from "./RightSidebar"
import useGetAllPost from "@/hooks/useGetAllPost"
import Posts from "./Posts"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetFollowings from "@/hooks/useGetFollowings";

export default function Home() {
  useGetAllPost();
  useGetSuggestedUsers();
  // Fetch followings data on app load using the custom hook
  useGetFollowings();
  return (
    <div className="flex">
      <div className="flex-grow  min-w-max">
        <Posts />
      </div>
      <div className="flex-1 min-w-max ">
        <RightSidebar />
      </div>
    </div>
  )
}
