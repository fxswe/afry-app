import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PersonsService } from '../persons/persons.service';
import { Company } from '../shared/models/company.model';
import { Person } from '../shared/models/person.model';
import { CompaniesService } from './companies.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit, OnDestroy {
  companies$: Observable<Company[]>
  companiesSubscription: Subscription
  personsSubscription: Subscription
  addCompanySubscription: Subscription
  deleteEmployeeSubscription: Subscription
  companies: Company[]
  persons: Person[]
  companyName: string
  selectedCompany: Company

  constructor(
    private CompaniesService: CompaniesService,
    private PersonsService: PersonsService
  ) { }

  ngOnInit() {
    this.companies$ = this.CompaniesService.getCompanies()
    this.companiesSubscription = this.CompaniesService.companies.subscribe((companies: Company[]) => {
      this.companies = companies
      if (this.selectedCompany) {
        const updatedCompany = this.companies.find(x => x.name == this.selectedCompany.name)
        this.setSelectedCompany(updatedCompany)
      }
    }
    )
    this.PersonsService.getPersons()
    this.personsSubscription = this.PersonsService.persons.subscribe((persons: Person[]) =>
      this.persons = persons
    )
  }
  addCompany() {
    if (!this.validateCompany()) {
      return
    }
    const company = {
      name: this.companyName,
      employees: []
    }
    this.addCompanySubscription = this.CompaniesService.addCompany(company).subscribe(
      x => this.companies$ = this.CompaniesService.getCompanies()
    )
  }
  deleteEmployee(employee: Person) {
    const companyToUpdate = this.companies.find(x => x.name == this.selectedCompany.name)
    const updatedEmployeeList = [...companyToUpdate.employees.filter(x => x.name != employee.name)]
    this.deleteEmployeeSubscription = this.CompaniesService.deleteCompanyEmployee(companyToUpdate, updatedEmployeeList).subscribe(
      x => {
        this.companies$ = this.CompaniesService.getCompanies()
        this.setPersonUnemployed(employee)
      }
    )
  }
  setPersonUnemployed(employee: Person) {
    let personToUpdate = this.persons.find(x => x.name == employee.name)
    personToUpdate.isEmployed = false
    this.PersonsService.updatePerson(personToUpdate)
  }
  setSelectedCompany(company: Company) {
    this.selectedCompany = company
  }
  validateCompany() {
    if (!this.companyName) {
      alert('Company name is mandatory')
      return false
    }
    const companyAleadyExists = this.companies.find(x => x.name == this.companyName)
    if (companyAleadyExists) {
      alert('Company already exists!')
      this.companyName = ''
      return false
    }
    return true
  }
  ngOnDestroy() {
    this.companiesSubscription.unsubscribe()
    this.personsSubscription.unsubscribe()
    if (this.addCompanySubscription) {
      this.addCompanySubscription.unsubscribe()
    }
    if (this.deleteEmployeeSubscription) {
      this.deleteEmployeeSubscription.unsubscribe()
    }
  }
}
