import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<object>();

  constructor(private crud: CrudService) { }


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

  enviar(email: any, inicial: any, final: any) {
    console.log("enviar-> ", email, inicial, final);
    this.crud.sendEmail(email, inicial, final).subscribe();
  }

  onSubmit() {
    this.newItemEvent.emit([this.profileForm.value]);
    // console.log(this.profileForm.value);
  }

}

