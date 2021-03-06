import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { FeeType } from './../models/index';


@Injectable()
export class FeeService {

  constructor(private http: Http) { }

  // API Call to get the list of fee type records
  getFeeTypes(feeTypeCode: string): Promise<FeeType> {
    return this.http.get(this.getBaseUrl() + '/feetype?feeTypeCode=' + feeTypeCode, this.getHeaders())
               .toPromise()
               .then(response => response.json().feeType as FeeType)
               .catch(this.handleError);
  }

  // private helper methods
  private getHeaders(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'SMS-TOKEN ' + currentUser.token });
        return new RequestOptions({ headers: headers });
      }
  }

  private getBaseUrl(): String{
    if(window.location.href.indexOf('localhost') > -1) return "http://localhost:9007/sms/v1/api"
    else return 'https://sms.ischoolmanager.com/sms/v1/api'
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}