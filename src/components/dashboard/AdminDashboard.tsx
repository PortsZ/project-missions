import React from 'react'
import MainButton from '../buttons/MainButton'

const AdminDashboard = () => {
  return (
    <div className='md:w-1/2 w-full md:px-24 grid grid-cols-3 text-center text-white gap-10 justify-center items-center'>
        
        <div className='bg-contrast rounded-lg p-16'>Add Church/Org</div>
        <div className='bg-contrast rounded-lg p-16'>Add Mission</div>
        <div className='bg-contrast rounded-lg p-16'>Add Missionary</div>
    </div>
  )
}

export default AdminDashboard