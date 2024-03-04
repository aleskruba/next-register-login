
export type UserProps = {
    id: any;
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
    id:string;
    f_name: string;
    l_name: string;
    email: string;
    image?: string | null;
    hashedPassword?: string | null;
    languages?: string | null;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
    classesIds?:string[];
    classes: ClassProps[];
    gradesIds: GradeProps[];
    gradeses: GradeProps[];
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
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
    classesIds: string[];
    classes: ClassProps[];
    gradesIds: string[];
    grades: GradeProps[];
  };
  
  // Define an array type with the StudentsProps type
  export type TeachersArray = TeachersProps[];


  export type ClassProps = {
    id:string;
    classCode: string;
    language: string;
    schedule: string;
    teacherID?: string;
    studentID?: string;
    studentClassesIds?: string[];
    studentClasses: StudentsProps[];
    teacherClassesIds: string[];
    teacherClasses: TeachersProps[];

  };
  
  export type TeacherDetails = {
    id: string;
    f_name?: string;
    l_name?: string;
    // Add other properties as needed
  };

  export type StudentDetails = {
    id: string;
    f_name: string;
    l_name: string;
    // Add other properties as needed
  };

  export type ClassArray = ClassProps[];

  
  export type GradeProps = {
    id: string;
    comment?: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
    studentGradesIds: string[];
    studentGrades: StudentsProps[];
    teacherGradesIds: string[];
    teacherGrades: TeachersProps[];
};