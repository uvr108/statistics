import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { DataService } from "../../shared/data.service";
import { Subscription } from 'rxjs';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  data:any;

  message!:string;
  subscription!: Subscription;

  constructor(private crud: CrudService, private datos: DataService) { }

  ngOnInit(): void {
    
    this.crud.getData(null,null,true,true, true ,true,true).subscribe( data => { this.data = data; });
    this.subscription = this.datos.currentMessage.subscribe(message => { 
      this.message = message;
      this.convierte(); 
    });

  }  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  convierte() {

    let col:any = [];
    let row:any = [];
    let ini = true;
    let keys:any = [];

    if (this.data) {
      this.data.forEach((elem:any) => {

          Object.entries(elem).forEach(
          ([key, value]) => {
            if (ini) { keys.push(key);  }
            col.push(value);
          }
          );
          if (ini) { row.push(keys);  }
          row.push(col);
          col=[];
          ini=false;
    });
      // console.log(keys);
      // console.log(row);
      console.log('yyy ->', this.message);
      let out = new AngularCsv(row, this.message.toString());
    }
   
  }

  select(newItem: any) {

     // console.log('newItem->', newItem);

     const per_ini = newItem[0].per_ini;
     const per_fin = newItem[0].per_fin;

     const preliminary =  newItem[0].preliminary;
     const confirmed = newItem[0].confirmed;
     const reviewed = newItem[0].reviewed;
     const final = newItem[0].final;
     const perceived = newItem[0].perceived;

    this.crud.getData(per_ini, per_fin, preliminary, confirmed, reviewed, final, perceived).subscribe(data => {
      this.data=data;
    });

  }

}
