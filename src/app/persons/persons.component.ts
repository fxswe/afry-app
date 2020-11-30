import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompaniesService } from '../companies/companies.service';
import { Company } from '../shared/models/company.model';
import { Person } from '../shared/models/person.model';
import { PersonsService } from './persons.service';
@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {
  companies: Company[]
  unemployedPersons: Person[]
  companiesSubscription: Subscription
  unemployedPersonsSubscription: Subscription
  hideDetailsSubscription: Subscription
  showDetails = false
  selectedPerson: Person
  constructor(
    private personsService: PersonsService,
    private CompaniesService: CompaniesService
  ) { }
  ngOnInit() {
    this.CompaniesService.getCompanies()
    this.companiesSubscription = this.CompaniesService.companies.subscribe(companies =>
      this.companies = companies
    )
    this.personsService.getPersons()
    this.unemployedPersonsSubscription = this.personsService.persons.subscribe(persons => {
      this.unemployedPersons = persons.filter(x => !x.isEmployed)
      }
    )
    this.hideDetailsSubscription = this.personsService.hidePersonDetails.subscribe(hideDetails=> {
      if(hideDetails){
        this.hidePersonDetails()
      }
    })
  }
  showPersonDetails(person: Person) {
    this.selectedPerson = person
    this.showDetails = true
  }
  hidePersonDetails() {
    this.selectedPerson = null
    this.showDetails = false
  }
  ngOnDestroy(){
    this.companiesSubscription.unsubscribe()
    this.unemployedPersonsSubscription.unsubscribe()
    this.hideDetailsSubscription.unsubscribe()
  }
}