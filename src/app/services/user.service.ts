import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RoleAttribute } from './../models/index';


@Injectable()
export class UserService {

  private baseUrl  = 'http://localhost:9010/sms/v1/api/';  // URL to web api

  constructor(private http: Http) { }

  // API Call to get the list of user's role attributes on the logged in user token
  getUserRoleAttributes(userId: number): Promise<RoleAttribute[]> {
    return this.http.get(this.baseUrl + 'roleattributes?userId=' + userId, this.getHeaders())
               .toPromise()
               .then(response => response.json().roleAttributes as RoleAttribute[])
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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}