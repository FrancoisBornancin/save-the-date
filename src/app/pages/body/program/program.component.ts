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
    this.inMemoryRepository.imageFolder = 'repository/program-images-repository';
    this.inMemoryRepository.layoutJsonName = 'json-layout/page-component-layout.json';
  } 

}
