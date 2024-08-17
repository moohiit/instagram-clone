import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function MainLayout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className='flex'>
      <LeftSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div className={`flex-1  ${collapsed ? 'ml-12' : 'ml-[17rem]'}`}>
        <Outlet/>
      </div>
    </div>
  )
}
export default MainLayout
