export class Person {
    id?: string
    name: string
    isEmployed: boolean
    constructor(name: string, isEmployed: boolean, id?: string) {
        this.id = id;
        this.name = name;
        this.isEmployed = isEmployed;
    }
}