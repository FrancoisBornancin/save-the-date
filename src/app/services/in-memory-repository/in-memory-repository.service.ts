import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { NumberContainer } from '../../model/number-container';
import { StringContainer } from '../../model/string-container';

@Injectable({
  providedIn: 'root'
})
export class InMemoryRepositoryService {
  upperImageFolder!: string
  belowImageFolder!: string
  layoutJsonName!: string

  constructor() { }
}
