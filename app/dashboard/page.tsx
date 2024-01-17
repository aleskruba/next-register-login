import { DataTableDemo } from '@/components/TableComponent'
import React from 'react'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  return (
    <div className='w-full'>
      <Navbar/>
      <DataTableDemo/>
    </div>
  )
}

export default Dashboard