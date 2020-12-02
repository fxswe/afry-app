import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from '../shared/models/company.model';
import { Person } from '../shared/models/person.model';


@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  companies = new BehaviorSubject<Company[]>(new Array<Company>())

  constructor(private http: HttpClient) { }

  getCompanies() {
    return this.http.get<Company[]>('https://afry-app.firebaseio.com/companies.json')
      .pipe(
        map(response => {
         const companies: Company[] = []
         for (const key in response){
            companies.push({...response[key], id: key})
         }
         this.companies.next(companies)
         return companies
        })
      ).subscribe()
  }
  addCompany(company: Company) {
    return this.http.post('https://afry-app.firebaseio.com/companies.json', company).subscribe(
        x => this.getCompanies()
      )
  }
  updateCompanyEmployee(company: Company) {
    return this.http.put(`https://afry-app.firebaseio.com/companies/${company.id}.json`, company).subscribe()
  }
  deleteCompanyEmployee(company: Company, employees: Person[]) {
    return this.http.put(`https://afry-app.firebaseio.com/companies/${company.id}/employees.json`, employees)
  }
}