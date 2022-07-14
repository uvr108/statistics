import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../shared/crud.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  data:any;

  constructor(private crud: CrudService) { }

  ngOnInit(): void {
    this.crud.getData(null,null,true,true, true ,true,true).subscribe( data => { this.data = data; })

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
