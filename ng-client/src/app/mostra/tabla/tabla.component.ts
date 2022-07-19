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
  p=0;
  message!:string;
  subscription!: Subscription;
  informe!:object;

  constructor(private crud: CrudService, private datos: DataService) { }

  ngOnInit(): void {
    
    this.crud.getData(null,null,true,true, true ,true,true).subscribe( data => { 
      this.data = data;
      this.getinfo(); 
 
    });
    
    this.subscription = this.datos.dataMessage.subscribe(message => { 
      this.message = message;
      this.convierte();
 
    });
  }  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getinfo(): void {
   
    
    if (this.data) {

      let total = 0;
      let perceived = 0;
      let email = 0;
      let mayor_5 = 0;
      let mayor_20 = 0;
      let preliminary = 0;
      let final = 0;


      this.data.forEach((el:any) => { 
        if (el.perceived == '') { perceived+=1; }
        if (el.email) { email+=1; }
        if (el.mayor_5) { mayor_5+=1; }
        if (el.mayor_20) { mayor_20+=1; }
        if (el.evaluation_status == 'preliminary') { preliminary+=1; }
        if (el.evaluation_status == 'final') { final+=1; }
        total+=1;
      }
    )
      this.informe = {perceived, email, mayor_5, mayor_20, preliminary, final, total}
      console.log(this.informe);
  }


    
  } 

  convierte(): void {  // convierte data para csv

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
      // console.log('yyy ->', this.message);
      let out = new AngularCsv(row, this.message.toString());
    }
   
  }

  select(newItem: any) {

     console.log('newItem->', newItem);

     const per_ini = newItem[0].per_ini;
     const per_fin = newItem[0].per_fin;

     const preliminary =  newItem[0].preliminary;
     const confirmed = newItem[0].confirmed;
     const reviewed = newItem[0].reviewed;
     const final = newItem[0].final;
     const perceived = newItem[0].perceived;

    this.crud.getData(per_ini, per_fin, preliminary, confirmed, reviewed, final, perceived).subscribe(data => {
      console.log(this.data);
      this.data=data;
      this.getinfo(); 
    });

  }

}
