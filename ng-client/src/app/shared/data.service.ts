import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSource = new BehaviorSubject('Mensage Inicial');
  dataMessage = this.dataSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.dataSource.next(message)
  }

}
