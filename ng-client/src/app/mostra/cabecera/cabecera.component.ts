import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { CrudService } from '../../shared/crud.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<object>();

  constructor(private crud: CrudService) { }

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
  
  }

  bajar() {
    this.time = (new Date).getTime();
    console.log("time-> ", this.time);
    // this.crud.sendEmail(email, inicial, final).subscribe();
  }

  onSubmit() {
    this.newItemEvent.emit([this.profileForm.value]);
    // console.log(this.profileForm.value);
  }

}

