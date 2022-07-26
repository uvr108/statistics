import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  // Base url
  baseurl = 'http://127.0.0.1:3000/api';

 // Http Headers

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  constructor(private http: HttpClient) { }

  sendEmail(email:any, inicial:any, final: any): Observable<any> {
    let parameters = { email, inicial, final };
    let queryParams = new HttpParams({ fromObject: parameters }); 
    var  baseurl = this.baseurl + '/email';
    console.log("queryParams -> ", queryParams);
    return this.http.get<any>(baseurl, {params:queryParams})
    .pipe(
      retry(2),
      catchError(this.handleError)
    );

  }
  

  getData(per_ini:any,
          per_fin:any, 
          preliminary: boolean,
          reviewed: boolean,
          final: boolean,
          perceived: boolean): Observable<any> {
    
    var  baseurl = this.baseurl + '/data';
    
    let parameters = {per_ini, per_fin, preliminary, reviewed, final, perceived};

    // console.log(parameters);

    let queryParams = new HttpParams({ fromObject: parameters });   
    
    return this.http.get<any>(baseurl, {params:queryParams})
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

}
