// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import MainLayout from "./MainLayout"
// import Feeds from "./Feeds"
// import { Outlet } from "react-router-dom"
import RightSidebar from "./RightSidebar"
import useGetAllPost from "@/hooks/useGetAllPost"
import Posts from "./Posts"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

export default function Home() {
  useGetAllPost();
  useGetSuggestedUsers();
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
