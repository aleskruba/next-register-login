import Link from 'next/link'
import React from 'react'

function Class() {
  return (
    <div className='flex flex-col'>
        <div>
            <Link href='createclass'>
                Create class

            </Link>
        </div>

        <div>
        Classes
        </div>
   
    </div>
  )
}

export default Class