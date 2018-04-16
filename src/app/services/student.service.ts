import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Student, StudentFee, StudentAddress, StudentGrade, StudentCategoryGrade, Term, Subject, SubjectCategory, StudentAttendance } from './../models/index';


@Injectable()
export class StudentService {

  constructor(private http: Http) { }

  // API Call to get the list of student records based on the logged in userId
  getStudents(userId: number): Promise<Student[]> {
    return this.http.get(this.getBaseUrl() + '/students?userId=' + userId, this.getHeaders())
               .toPromise()
               .then(response => response.json().students as Student[])
               .catch(this.handleError);
  }

  // API Call to get the Student Address for a given student Id. 
  getStudentAddress(studentId: number): Promise<StudentAddress[]> {
    return this.http.get(this.getBaseUrl() + '/studentaddress?studentId=' + studentId, this.getHeaders())
               .toPromise()
               .then(response => response.json().studentAddress as StudentAddress[])
               .catch(this.handleError);
  }  

  // API Call to get the Student Grades for a given student Id. 
  getStudentGrades(studentId: number): Promise<StudentGrade[]> {
    return this.http.get(this.getBaseUrl() + '/studentgrade?studentId=' + studentId, this.getHeaders())
               .toPromise()
               .then(response => response.json().studentGrades as StudentGrade[])
               .catch(this.handleError);
  } 

  // API Call to get the StudentCategory Grades for a given student Id. 
  getStudentCategoryGrades(studentId: number, termCode: string, subjectCode: string): Promise<StudentCategoryGrade[]> {
    return this.http.get(this.getBaseUrl() + '/studentcategorygrade?studentId=' + studentId + '&termCode=' + termCode + '&subjectCode='+ subjectCode, this.getHeaders())
               .toPromise()
               .then(response => response.json().studentCategoryGrades as StudentCategoryGrade[])
               .catch(this.handleError);
  }   

  // API Call to get all the Term records 
  getTerms(): Promise<Term[]> {
    return this.http.get(this.getBaseUrl() + '/term', this.getHeaders())
               .toPromise()
               .then(response => response.json().terms as Term[])
               .catch(this.handleError);
  } 

  // API Call to get all the Subject records 
  getSubjects(): Promise<Subject[]> {
    return this.http.get(this.getBaseUrl() + '/subject', this.getHeaders())
               .toPromise()
               .then(response => response.json().subjects as Subject[])
               .catch(this.handleError);
  }   

  // API Call to get all the Subject Category records 
  getSubjectCategories(): Promise<SubjectCategory[]> {
    return this.http.get(this.getBaseUrl() + '/subjectcategory', this.getHeaders())
               .toPromise()
               .then(response => response.json().subjectCategories as SubjectCategory[])
               .catch(this.handleError);
  }     

  getStudentAttendances(studentId: number): Promise<StudentAttendance[]> {
    return this.http.get(this.getBaseUrl() + '/studentattendance?studentId=' + studentId, this.getHeaders())
               .toPromise()
               .then(response => response.json().studentAttendances as StudentAttendance[])
               .catch(this.handleError);
  } 


  getStudentFees(studentId: number): Promise<StudentFee[]> {
    return this.http.get(this.getBaseUrl() + '/studentfee?studentId=' + studentId, this.getHeaders())
               .toPromise()
               .then(response => response.json().studentFees as StudentFee[])
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