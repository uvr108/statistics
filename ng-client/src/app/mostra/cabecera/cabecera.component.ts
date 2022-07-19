import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { DataService } from "../../shared/data.service";
import { Subscription } from 'rxjs';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<object>();
  @Input() informe!:any;

  constructor(private crud: CrudService,private datos: DataService ) { }

  message!:string;
  subscription!: Subscription;


  time:any;

  profileForm = new FormGroup({
    per_ini: new FormControl(),
    per_fin: new FormControl(),
    preliminary: new FormControl(true),
    confirmed: new FormControl(true),
    reviewed: new FormControl(true),
    final: new FormControl(true),
    perceived: new FormControl(true)
  });

  ngOnInit(): void {
    this.subscription = this.datos.dataMessage.subscribe(message => this.message = message)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /*
  newMessage() {
    this.datos.changeMessage("Hello from Sibling")
  }
  */
 
  bajar() {

    this.time = (new Date).getTime();
    this.datos.changeMessage(this.time)
  
  }

  getinforme() {

    let row:any=[];

    if (this.informe) {

          let time = (new Date).getTime();
  
          Object.entries(this.informe).forEach(
            ([key, value]) => {
              row.push([key, value])            
            }
          );
          // console.log(row)
          let out = new AngularCsv(row, time.toString());
        }
  }

  onSubmit() {
    this.newItemEvent.emit([this.profileForm.value]);
    // console.log(this.profileForm.value);
  }

}

