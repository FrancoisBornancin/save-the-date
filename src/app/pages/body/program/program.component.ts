import { Component, OnInit } from '@angular/core';
import { InMemoryRepositoryService } from '../../../services/in-memory-repository/in-memory-repository.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss'
})
export class ProgramComponent{
  constructor(
    public inMemoryRepository: InMemoryRepositoryService,
  ){
    this.inMemoryRepository.upperImageFolder = 'repository/upper-program-images-repository';
    this.inMemoryRepository.belowImageFolder = 'repository/below-program-images-repository';
    this.inMemoryRepository.layoutJsonName = 'json-layout/program-component-layout.json';
  } 

}
