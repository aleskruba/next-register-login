import React from 'react'

function InfoPage() {
  return (
    <div className=" mx-2  bg-gray-600 rounded-lg shadow-lg p-6">
    <h2 className="text-xl font-bold mb-4 text-green-600">For Admins</h2>

    <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">User Management</h3>
        <p className="text-gray-200">Administrators can easily register new users such as teachers and students, ensuring everyone has access to the platform.</p>
    </div>


    <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Classes Creation</h3>
        <p className="text-gray-200">Admins can create Classes and add both teachers and students to them.</p>
    </div>

    <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Profile Updates</h3>
        <p className="text-gray-200">Admins can update teacher and student profiles as needed.</p>
    </div>


    <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-green-600">For Teachers</h3>

        <div className="mb-4">
            <h4 className="text-md font-semibold mb-1">Grade Management</h4>
            <p className="text-gray-200">Teachers can assign, update, and even delete grades for each student.</p>
        </div>

  
        <div className="mb-4">
            <h4 className="text-md font-semibold mb-1">Real-time Communication</h4>
            <p className="text-gray-200">Teachers can communicate with students via chatroom.</p>
        </div>

  
        <div className="mb-4">
            <h4 className="text-md font-semibold mb-1">Classes</h4>
            <p className="text-gray-200">Teachers can have more than just one Class.</p>
        </div>
    </div>


    <div>
        <h3 className="text-lg font-semibold mb-2 text-green-600">For Students</h3>


        <div className="mb-4">
            <h4 className="text-md font-semibold mb-1">Profile Management</h4>
            <p className="text-gray-200">Students can easily view and update their profiles.</p>
        </div>

    
        <div className="mb-4">
            <h4 className="text-md font-semibold mb-1">Grade Tracking</h4>
            <p className="text-gray-200">Students can view their grades.</p>
        </div>


        <div>
            <h4 className="text-md font-semibold mb-1">Real-time Communication</h4>
            <p className="text-gray-200">Students can communicate with schoolmates and teachers from their className via chatroom.</p>
        </div>
    </div>
</div>
  )
}

export default InfoPage