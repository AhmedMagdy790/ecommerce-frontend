export interface User {
    id:number;
    name:string;
    email:string;
    phone:string|null;
    roles:string[];
    avatar?:string|null;
}