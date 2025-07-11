import NavBar from '@/components/NavBar'
import React from 'react'

function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='relative flex h-screen flex-col'>
        <NavBar/>
        <div className='w-full'>
            {children}
        </div>
    </div>
  )
}

export default layout
