import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';

/*
  Generated class for the GroceriesServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceriesServiceProvider {

  items: any = [];

  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseUrl = "http://localhost:8080";

  constructor(public http: HttpClient) {
    console.log('Hello GroceriesServiceProvider Provider');

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  //API to get Items for the grocery list
  getItems(): Observable<object[]> {
    return this.http.get(this.baseUrl + '/api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  private extractData(res: Response){
      let body = res;
      return body || {};
  }

  //Helper method to handle error
  private handleError(error: Response | any){

    let errMsg: string;
    if(error instanceof Response){
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    }else{
      errMsg = error.message ? error.message : errMsg.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  //API to remove item from the list
  removeItem(id) {
    console.log("Remove Item - id = ", id);
    this.http.delete(this.baseUrl + "/api/groceries" + id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

  //API to add item to the list
  addItem(item) {
    this.http.post(this.baseUrl + "/api/groceries" , item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

  //API to edit item on the list
  editItem(item, index) {
    console.log("Editing item = ", item);
    this.http.put(this.baseUrl + "/api/groceries" + item._id, item ).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

}
