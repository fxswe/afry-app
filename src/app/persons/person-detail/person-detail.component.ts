import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompaniesService } from 'src/app/companies/companies.service';
import { Company } from 'src/app/shared/models/company.model';
import { Person } from 'src/app/shared/models/person.model';
import { PersonsService } from '../persons.service';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent implements OnInit {
  private _selectedPerson: Person;
  @Input() set selectedPerson(value: Person) {
    this._selectedPerson = value;
    this.selectedCompany = null
  }
  get selectedPerson(): Person {
    return this._selectedPerson;
  }
  persons: Person[]
  companiesSubscription: Subscription
  companies: Company[]
  selectedCompany: Company
  personName: string
  constructor(
    private PersonsService: PersonsService,
    private CompaniesService: CompaniesService
  ) { }
  ngOnInit() {
    this.CompaniesService.getCompanies()
    this.companiesSubscription = this.CompaniesService.companies.subscribe((companies: Company[]) =>
    this.companies = companies
  )
    this.PersonsService.getPersons()
    this.PersonsService.persons.subscribe(persons => {
      this.persons = persons
    })
  }
  addPerson() {
    if (!this.validatePerson()) {
      return
    }
    if (!this.validateCompany()) {
      return
    }
    const person = new Person(this.personName, true)
    this.PersonsService.addPerson(person)
    this.updateCompany()
    alert("Person created")
    this.clearPerson()
  }
  updatePerson() {
    if (!this.validateCompany()) {
      return
    }
    this.setPersonEmployed(this.selectedPerson)
    alert("Person updated")
    this.updateCompany()
  }
  setPersonEmployed(employee: Person){
    let personToUpdate = this.persons.find(x => x.name == employee.name)
    personToUpdate.isEmployed = true
    this.PersonsService.updatePerson(personToUpdate)
  }
  updateCompany() {
    const name = this.selectedPerson ? this.selectedPerson.name : this.personName
    if(!this.selectedCompany.employees) {
      this.selectedCompany['employees'] = [new Person(name, true)]
    }
    else {
      this.selectedCompany.employees.push(new Person(name, true))
    }
    this.CompaniesService.updateCompanyEmployee(this.selectedCompany)
  }
  validateCompany() {
    if (!this.selectedCompany) {
      alert('Company needs to be selected')
      return false
    }
    return true
  }
  validatePerson() {
    if(!this.personName) {
      alert('Person name is mandatory')
      return false
    }
    const personAleadyExists = this.persons.find(x => x.name == this.personName)
    if (personAleadyExists) {
      alert('Person already exists!')
      this.clearPerson()
      return false
    }
    return true
  }
  clearPerson() {
    this.personName = ""
    this.selectedCompany = null
  }
}
