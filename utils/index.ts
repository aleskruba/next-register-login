
  import * as z from "zod"
import { ClassArray, StudentsProps, TeachersProps, UserProps,GradeProps, NewGrade, PostProps} from "@/types";
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


export async function fetchMyProfile(params: any) {

  const response = await fetch(`/api/myprofile/${params}`)
  const data = await response.json()

return data.data
}

export async function fetchMyProfileTeacher(params: any) {

  const response = await fetch(`/api/myprofileteacher/${params}`)
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
      throw new Error('Failed to update a student');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during updating a student:', error);

  }
}

export async function updateTeacherProfile(teacher: TeachersProps) {
  try {
    const response = await fetch(`/api/myprofileteacher/${teacher}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacher),
    });

    if (!response.ok) {
      throw new Error('Failed to update a student');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during updating a teacher:', error);

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

export async function fetchClassesTeacher() {

  const response = await fetch(`/api/chooseclasses`)
  const data = await response.json()

return data.data
}

export async function fetchClasses() {

  const response = await fetch(`/api/classes`)
  const data = await response.json()

return data.data
}



export async function fetchMyClassesTeacher() {

  const response = await fetch(`/api/myclasses`)
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


export async function fetchGrade(grade:NewGrade) {

  const response = await fetch(`/api/grade`, {
          method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(grade),
      })

  const data = await response.json()

return data.data
}



export async function deleteGrade(grade:any) {

  try {
    const response = await fetch('/api/grade', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grade),
    });

    if (!response.ok) {
      throw new Error('Failed to delete the grade');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during deleting the grade:', error);

  }
}


export async function updateGrade(grade:any) {

  try {
    const response = await fetch('/api/grade', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grade),
    });

    if (!response.ok) {
      throw new Error('Failed to update the grade');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during updating the grade:', error);

  }
}


export async function updateProfileImage(image:any) {

  try {
    const response = await fetch('/api/updateprofileimage', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(image),
    });

    if (!response.ok) {
      throw new Error('Failed to update the image');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during updating the grade:', error);

  }
}

export async function updatePassword(data: { password: string; repeatpassword: string; }) {

  try {
    const response = await fetch('/api/register', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update the password');
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error during updating the password:', error);
  }
}





export async function sendMessage(message: PostProps) {
  try {
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const responseData: ClassResponseType = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error creating message:', error);

    throw error;

  }
}





export async function fetchMessages() {

  const response = await fetch(`/api/messages`)
  const data = await response.json()

return data.data
}


export async function sendMessageTeacher(message: PostProps,params: any) {
  try {
    const response = await fetch(`/api/chatboxes/${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const responseData: ClassResponseType = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error creating message:', error);

    throw error;

  }
}

export async function fetchMessagesTeacher(params: any) {

  const response = await fetch(`/api/chatboxes/${params}`)
  const data = await response.json()

return data.data
}


export async function deleteMessage(grade:any) {

  try {
    const response = await fetch('/api/message', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(grade),
    });

    if (!response.ok) {
      throw new Error('Failed to delete the message');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during deleting the grade:', error);

  }
}


export async function fetchActiveUsers(cl:any) {

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cl),
    });

    if (!response.ok) {
      throw new Error('Failed fetching active user');
    }

    const responseData = await response.json();
    return responseData


  } catch (error) {
    console.error('Error during Failed fetching active user:', error);

  }
}
