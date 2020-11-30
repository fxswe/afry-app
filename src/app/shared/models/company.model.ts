import { Person } from './person.model';

export class Company {
    id?: string
    name: string
    employees?: Person[]

    constructor(name: string, employees?: Person[], id?: string) {
        this.id = id
        this.name = name
        this.employees = employees
    }
}