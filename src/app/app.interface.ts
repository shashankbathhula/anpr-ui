export interface SignIn {
    email: string;
    password: string;
}

export interface Signup {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface GenericResponse {
    success: boolean;
    message: string;
    status: number;
    data: any;
}

export interface User {
    firstName: string;
    lastName: string;
    email:string;
    password: string;
    enabled: boolean;
    confirmationToken: string;
}

export interface Column {
    field: string;
    header: string;
}