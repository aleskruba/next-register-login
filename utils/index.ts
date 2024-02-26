
  import * as z from "zod"
import { ClassArray, StudentsProps, TeachersProps, UserProps } from "@/types";
import { ClassProps } from "@/types";  


  const formSchema = z.object({
    email: z.string().email(),
    f_name: z.string().min(3).max(25),
    l_name: z.string().min(3).max(25),
    languages:z.string().optional(),
    password: z.string().min(3).max(25),
    confirm_password: z.string().min(3).max(25),
    role: z.enum(["Student","Teacher","Admin"]),

  }).refine((data)=>{
    return data.password === data.confirm_password
  },{
    message :"Passwords do not match",
    path: ["confirm_password"]
  })
  
export async function createUser(user:z.infer<typeof formSchema>){
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
 
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      const responseData = await response.json();

    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error logic here, set error state, show a notification, etc.
    }
  }

  export async function fetchCurrentUser(user: string): Promise<UserProps> {
    try {
      const response = await fetch('/api/currentuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      const responseData = await response.json();
      return responseData.data; // Return the parsed data
  
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error logic here, set error state, show a notification, etc.
      throw error; // Re-throw the error to be caught in the calling code
    }
  }
  

  export async function fetchStudents() {

    const response = await fetch(`/api/students`)
    const data = await response.json()

return data.data
}


export async function fetchStudent(params: any) {

  const response = await fetch(`/api/student/${params}`)
  const data = await response.json()

return data.data
}


export async function deleteStudent(studentID: string) {
  try {
    const response = await fetch(`/api/student/${studentID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentID),
    });

    if (!response.ok) {
      throw new Error('Failed to delete a student');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during deleting a student:', error);

  }
}


export async function fetchTeacher(params: any) {

  const response = await fetch(`/api/teacher/${params}`)
  const data = await response.json()

return data.data
}

export async function deleteTeacher(teacherID: string) {
  try {
    const response = await fetch(`/api/teacher/${teacherID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherID),
    });

    if (!response.ok) {
      throw new Error('Failed to delete a teacher');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during deleting a teacher:', error);

  }
}

export async function updateStudent(student: StudentsProps) {
  try {
    const response = await fetch(`/api/student/${student}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      throw new Error('Failed to delete a student');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during deleting a student:', error);

  }
}

export async function updateTeacher(teacher: TeachersProps) {
  try {
    const response = await fetch(`/api/teacher/${teacher}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacher),
    });

    if (!response.ok) {
      throw new Error('Failed to delete a teacher');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during deleting a teacher:', error);

  }
}


export async function fetchTeachers() {

  const response = await fetch(`/api/teachers`)
  const data = await response.json()

return data.data
}

interface ClassResponseType {
  message: string;
  // Add other properties as needed
}

export async function createClass(classData: ClassProps): Promise<ClassResponseType> {
  try {
    const response = await fetch('/api/class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      throw new Error('Failed to create class');
    }

    const responseData: ClassResponseType = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error creating class:', error);

    // Option 1: Rethrow the error
    throw error;

    // Option 2: Return a default value or error object
    // return { message: 'Failed to create class' };
  }
}



export async function fetchClasses() {

  const response = await fetch(`/api/classes`)
  const data = await response.json()

return data.data
}

export async function deleteClass(classID: string) {
  try {
    const response = await fetch('/api/class', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classID),
    });

    if (!response.ok) {
      throw new Error('Failed to delete class');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during deletin a class:', error);

  }
}

export async function updateClass(updatedClass:ClassProps) {
  try {
    const response = await fetch('/api/class', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedClass),
    });

    if (!response.ok) {
      throw new Error('Failed to update class');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error creating class:', error);

  }
}

export async function updateStudentsInClass(classData: ClassArray): Promise<void> {

  console.log('classData',classData)
   try {
    const response = await fetch('/api/classes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      throw new Error('Failed to create class');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error creating class:', error);

  } 
}
