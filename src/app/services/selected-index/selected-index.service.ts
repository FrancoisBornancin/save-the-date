import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedIndexService {
  index!: number;

  constructor() { }
}
