
export type UserProps = {
    f_name: string;
    l_name: string;
    email: string;
    image?: string | null;
    hashedPassword?: string | null;
    languages?: string | null;
    role: string;
    createdAt?: Date ;
    updatedAt?: Date;
  } | null 


  export type StudentsProps = {
    f_name: string;
    l_name: string;
    email: string;
    image?: string | null;
    hashedPassword?: string | null;
    languages?: string | null;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  
  // Define an array type with the StudentsProps type
  export type StudentsArray = StudentsProps[];


  export type TeachersProps = {
    id:string;
    f_name: string;
    l_name: string;
    email: string;
    image?: string | null;
    hashedPassword?: string | null;
    languages?: string | null;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  
  // Define an array type with the StudentsProps type
  export type TeachersArray = TeachersProps[];


  export type ClassProps = {
    classCode: string;
    language: string;
    schedule: string;
    teacherID?: string;
    studentID?: string;
    teacherClasses?: TeacherDetails[];
    studentClasses?: StudentDetails[];
  };
  
  export type TeacherDetails = {
    id: string;
    f_name: string;
    l_name: string;
    // Add other properties as needed
  };

  export type StudentDetails = {
    id: string;
    f_name: string;
    l_name: string;
    // Add other properties as needed
  };

  export type ClassArray = ClassProps[];