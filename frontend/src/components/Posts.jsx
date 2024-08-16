import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

function Posts() {
  const { posts } = useSelector(store => store.post);
  return (
    <>
      {
        posts.map((post) =>
        <Post key={post._id} post={post} />
      )}
    </>
  )
}

export default Posts
