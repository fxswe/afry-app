import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from '../shared/models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  persons = new BehaviorSubject<Person[]>(new Array<Person>())
  hidePersonDetails = new BehaviorSubject<boolean>(true)

  constructor(private http: HttpClient) { }

  getPersons() {
    return this.http.get<Person[]>('https://afry-app.firebaseio.com/persons.json')
      .pipe(
        map(response => {
         const persons: Person[] = []
         for (const key in response){
          persons.push({...response[key], id: key})
         }
         this.persons.next(persons)
         return persons
        })
      ).subscribe()
  }
  addPerson(person: Person){
    return this.http.post('https://afry-app.firebaseio.com/persons.json', person).subscribe()
  }
  updatePerson(person: Person){
    return this.http.put(`https://afry-app.firebaseio.com/persons/${person.id}.json`, person).subscribe(x=> {
      this.getPersons()
      this.hidePersonDetails.next(true)
    })
  }
}