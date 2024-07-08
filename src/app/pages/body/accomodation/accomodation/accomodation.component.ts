import { Component } from '@angular/core';
import { InMemoryRepositoryService } from '../../../../services/in-memory-repository/in-memory-repository.service';

@Component({
  selector: 'app-accomodation',
  templateUrl: './accomodation.component.html',
  styleUrl: './accomodation.component.scss'
})
export class AccomodationComponent {
  constructor(
    public inMemoryRepository: InMemoryRepositoryService,
  ){
    this.inMemoryRepository.upperImageFolder = 'repository/accomodation-images-repository';
    this.inMemoryRepository.layoutJsonName = 'json-layout/accomodation-component-layout.json';
  } 
}
