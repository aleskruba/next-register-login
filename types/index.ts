
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
