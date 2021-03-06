import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User, UserSchool, School} from './../models/index';


@Injectable()
export class HomeService {

  private baseUrl  = 'https://sms.ischoolmanager.com/sms/v1/api/';
  constructor(private http: Http) {}
  
  getUser(emailUsername): Promise<User> {

    return this.http.get(this.getBaseUrl() + '/user?username=' + emailUsername, this.getHeaders())
               .toPromise()
               .then(response => response.json().user as User)
               .catch(this.handleError);
  }

  getUserSchool(userId: number): Promise<UserSchool[]> {
    return this.http.get(this.getBaseUrl() + '/userschool?userId='+userId, this.getHeaders())
               .toPromise()
               .then(response => response.json().userSchoolInfoList as UserSchool[])
               .catch(this.handleError);
  }  
 
  getSchool(schoolCode: string): Promise<School> {
    return this.http.get(this.getBaseUrl() + '/school?schoolCode='+schoolCode, this.getHeaders())
               .toPromise()
               .then(response => response.json().school as School)
               .catch(this.handleError);
  }  

  private getHeaders(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'SMS-token ' + currentUser.token });
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