import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from './../models/index';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }
    
    login(username: string, password: string, selectedSchoolCode: string, userTypeCode: string) {
        return this.http.post(this.getBaseUrl() + '/authenticate', { username: username, password: password, schoolCode: selectedSchoolCode, userTypeCode: userTypeCode})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                console.log("response:" + response.json)

                let user = response.json().user as User;
                if (user != null && user.token != null) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

            });
    }

    private getBaseUrl(): String{
        if(window.location.href.indexOf('localhost') > -1) return "http://localhost:9007/sms/v1/api"
        else return 'https://sms.ischoolmanager.com/sms/v1/api'
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}