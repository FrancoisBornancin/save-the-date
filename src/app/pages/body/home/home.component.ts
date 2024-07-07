import { Component } from '@angular/core';
import { InMemoryRepositoryService } from '../../../services/in-memory-repository/in-memory-repository.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    public inMemoryRepository: InMemoryRepositoryService,
  ){
    this.inMemoryRepository.imageFolder = 'repository/home-images-repository';
    this.inMemoryRepository.layoutJsonName = 'json-layout/home-component-layout.json';
  } 
}
