export class Employee {
    employeeId?: number
    firstName?: string
    lastName?: string
    identity?:string
    birthDate?:Date
    entryDate?:Date
    gender?:Gender
}

export enum Gender{
    Male,Female
}