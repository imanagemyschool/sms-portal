import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import {NgbTabsetConfig, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { StudentService }  from './../services/index';
import { Student, StudentAddress, StudentGrade, Term, Subject, SubjectCategory, StudentAttendance, AttendanceSummary }  from './../models/index';
import {GridOptions} from 'ag-grid/main';
import { SubjectHyperlinkComponent } from './index';
import { JSONSerializationUtils } from './../utils/index';
import { User } from './../models/index';

@Component({
  moduleId: module.id,
  templateUrl: 'parent.component.html'
})

export class ParentComponent implements OnInit{

  students: Student[];
  selectedStudentId: number;
  selectedStudent: Student;
  selectedStudentAddress: StudentAddress;
  studentGrades: StudentGrade[];
  gridOptions:GridOptions;
  attendanceGridOptions:GridOptions;
  attendanceDaysGridOptions:GridOptions;
  terms:Term[];
  subjects:Subject[];
  subjectCategories: SubjectCategory[];
  activeTabChangeEvent: NgbTabChangeEvent;
  studentAttendances: StudentAttendance[];
  attendanceSummaries: AttendanceSummary[];
  presentDates:string[];
  excusedDates:string[];
  unexcusedDates:string[];
  suspendedDates:string[];
  tardyDates:string[];
  truancyDates:string[];
  numberOfPresentDaysPercentage:number;
  numberOfPresentDays:number;
  numberOfExcusedDays:number;
  numberOfUnexcusedDays:number;
  numberOfSuspendedDays:number;
  numberOfTardyDays:number;
  numberOfTruancyDays:number;
  numberOfEnrolledDays: number;

  constructor(config: NgbTabsetConfig, 
              private studentService: StudentService) {
    // customize default values of tabsets used by this component tree

    config.type = 'tabs';
    this.gridOptions = <GridOptions>{};
    this.attendanceGridOptions = <GridOptions>{};
    this.attendanceDaysGridOptions  = <GridOptions>{};
  }

  ngOnInit(): void {
     let user = JSONSerializationUtils.toInstance(new User, localStorage.getItem('currentUser'))
     this.getStudents(user.userId);
     this.getTerms();
     this.getSubjects();
     this.getSubjectCategories();
  }

  private getStudents(userId: number): void {
      this.studentService.getStudents(userId).then(students => {
          this.students = students
          if(this.students != null && this.students.length > 0){
              var firstStudent = this.students[0]
              this.selectedStudentId=firstStudent.studentId;
              this.getStudentData(null);
          }
      })
  }


  getStudentData(data: NgbTabChangeEvent): void {
      if(data != null) this.activeTabChangeEvent = data;
      for(let student of this.students){

          if(student.studentId == this.selectedStudentId){
              this.selectedStudent = student;

              // Get the Student Address
              if(this.activeTabChangeEvent != null && this.activeTabChangeEvent.nextId == "profileTab"){
                  this.studentService
                      .getStudentAddress(student.studentId)
                      .then(studentAddress => {
                          this.selectedStudentAddress = studentAddress[0]
                  });
              }

              // Get the Student Grades
              if(this.activeTabChangeEvent != null && this.activeTabChangeEvent.nextId == "gradeTab"){
                  this.studentService.getStudentGrades(student.studentId).then(studentGrades => { 
                      for(let studentGrade of studentGrades){
                          studentGrade.subjectDescription = this.getSubjectDescription(studentGrade.subjectCode)
                          studentGrade.termDescription = this.getTermDescription(studentGrade.termCode)
                      }
                      if(this.gridOptions.api != null) {
                          this.gridOptions.api.setRowData(studentGrades)
                          this.gridOptions.api.sizeColumnsToFit();
                      }  
                  })        
                  this.gridOptions.columnDefs = this.getColumnDefs();
              }

              if(this.activeTabChangeEvent != null && this.activeTabChangeEvent.nextId == "attendanceTab"){
                  let numberOfEnrolledDays = 15;
                  let numberOfPresentDays = 0;
                  let numberOfExcusedDays = 0;
                  let numberOfUnexcusedDays = 0;
                  let numberOfSuspendedDays = 0;
                  let numberOfTardyDays = 0;
                  let numberOfTruancyDays = 0;
                  let presentDays    = [];
                  let excusedDays    = [];
                  let unexcusedDays  = [];
                  let suspendedDays  = [];
                  let tardyDays      = [];
                  let truancyDays    = [];
                  let attendanceSummaries = [];
                  this.studentService.getStudentAttendances(student.studentId).then(studentAttendances => {
  
                      for(let studentAttendance of studentAttendances){
                          if(studentAttendance.presentFlag){
                              numberOfPresentDays++;
                              presentDays.push(studentAttendance.attendanceDate)
                          } 
                          else if(studentAttendance.excusedFlag){
                              numberOfExcusedDays++;
                              excusedDays.push(studentAttendance.attendanceDate)
                          } 
                          else if(studentAttendance.unexcusedFlag) {
                              numberOfUnexcusedDays++;
                              unexcusedDays.push(studentAttendance.attendanceDate)
                          }
                          else if(studentAttendance.suspendedFlag){
                              numberOfSuspendedDays++;
                              suspendedDays.push(studentAttendance.attendanceDate)
                          } 
                          else if(studentAttendance.tardyFlag){
                              numberOfTardyDays++;
                              tardyDays.push(studentAttendance.attendanceDate)
                          } 
                          else if(studentAttendance.truancyFlag){
                              numberOfTruancyDays++;
                              truancyDays.push(studentAttendance.attendanceDate)
                          } 
                      }


                      let attendanceSummary = new AttendanceSummary
                      attendanceSummary.presentDays=presentDays
                      attendanceSummary.excusedDays=excusedDays
                      attendanceSummary.unexcusedDays=unexcusedDays
                      attendanceSummary.suspendedDays=suspendedDays
                      attendanceSummary.tardyDays=tardyDays
                      attendanceSummary.truancyDays=truancyDays
                      attendanceSummaries.push(attendanceSummary)
                      this.attendanceSummaries = attendanceSummaries

                      this.presentDates = this.attendanceSummaries[0].presentDays;
                      this.excusedDates = this.attendanceSummaries[0].excusedDays;
                      this.unexcusedDates = this.attendanceSummaries[0].unexcusedDays;
                      this.suspendedDates = this.attendanceSummaries[0].suspendedDays;
                      this.tardyDates     = this.attendanceSummaries[0].tardyDays;
                      this.truancyDates   = this.attendanceSummaries[0].truancyDays;

                      this.numberOfPresentDays = numberOfPresentDays;
                      this.numberOfExcusedDays = numberOfExcusedDays;
                      this.numberOfUnexcusedDays = numberOfUnexcusedDays;
                      this.numberOfSuspendedDays = numberOfSuspendedDays;
                      this.numberOfTardyDays = numberOfTardyDays;
                      this.numberOfTruancyDays = numberOfTruancyDays;
                      this.numberOfEnrolledDays = numberOfEnrolledDays

                      this.numberOfPresentDaysPercentage = Math.round((this.numberOfPresentDays/this.numberOfEnrolledDays) * 100) 

                      if(this.attendanceGridOptions.api != null) {
                          this.attendanceGridOptions.api.setRowData(this.attendanceSummaries)
                          this.attendanceGridOptions.api.sizeColumnsToFit();
                      }        
                      this.attendanceGridOptions.columnDefs = this.getAttendanceColumnDefs();

                      if(this.attendanceDaysGridOptions.api != null) {
                          this.attendanceDaysGridOptions.api.setRowData(this.attendanceSummaries)
                          this.attendanceDaysGridOptions.api.sizeColumnsToFit();
                      }                           
                      this.attendanceDaysGridOptions.columnDefs = this.getAttendanceDaysColumnDefs();
                  })

              }              
          }
      }
  }


  private getAttendanceColumnDefs() {
      return [
          {headerName: "Total Present Days", field: "numberOfPresentDays", filter: 'text'}, 
          {headerName: "Total Excused Days", field: "numberOfExcusedDays", filter: 'text'},
          {headerName: "Total UnExcused Days", field: "numberOfUnexcusedDays", filter: 'text'},
          {headerName: "Total Tardy Days", field: "numberOfTardyDays", filter: 'text'},
          {headerName: "Total Truancy Days", field: "numberOfTruancyDays", filter: 'text'},
          {headerName: "Total Suspended Days", field: "numberOfSuspendedDays", filter: 'text'}
      ];
  }

  private getAttendanceDaysColumnDefs() {
      return [
          {headerName: "Present Dates", field: "presentDays", filter: 'text'}, 
          {headerName: "Excused Dates", field: "excusedDays", filter: 'text'},
          {headerName: "UnExcused Dates", field: "unexcusedDays", filter: 'text'},
          {headerName: "Tardy Dates", field: "tardyDays", filter: 'text'},
          {headerName: "Truancy Dates", field: "truancyDays", filter: 'text'},
          {headerName: "Suspended Dates", field: "suspendedDays", filter: 'text'}
      ];
  }  

  private getColumnDefs() {
      return [
          {headerName: "Subject", field: "subjectDescription", cellRendererFramework: SubjectHyperlinkComponent, filter: 'text'}, 
          {headerName: "Term", field: "termDescription", filter: 'text'},
          {headerName: "Teacher", field: "gradeTeacherName", filter: 'text'},
          {headerName: "%", field: "totalPercentage", filter: 'text'},
          {headerName: "Current Mark", field: "totalGradeMark", filter: 'text'}
      ];
  }

  private getTerms(): void {
      this.studentService.getTerms().then(terms => this.terms = terms)
  }

  private getSubjects(): void {
      this.studentService.getSubjects().then(subjects => this.subjects = subjects)
  }

  private getSubjectCategories(): void {
      this.studentService.getSubjectCategories().then(subjectCategories => {
          localStorage.setItem('subjectCategories', JSON.stringify(subjectCategories));      
          this.subjectCategories = subjectCategories
      })
  }

  private getSubjectDescription(subjectCode: string): any{
      for(let subject of this.subjects){
          if(subject.subjectCode == subjectCode) return subject.subjectDescription;
      }

      return "";
  }

  private getTermDescription(termCode: string): any{
      for(let term of this.terms){
          if(term.termCode == termCode) return term.termDescription;
      }

      return "";
  }  
 
  private getSubjectCategoryGradeDetails(content) {
      this.studentService.getStudentCategoryGrades(1, "QTR1", "SCIENCE_TRIM2").then(studentCategoryGrades => {
          localStorage.setItem('subjectCategoryGrades', JSON.stringify(studentCategoryGrades)); 
      })
  }   

  //<img onload="this.__gwtLastUnhandledEvent=&quot;load&quot;;" src="https://d3h6vjalfnzkit.cloudfront.net/8afa4c66074811e28ca042967fd53be7bcf34088/ec2/clear.cache.gif" style="width:16px;height:16px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpUlEQVR42q2TyytEURzH/QFWRCFTVhJF2WFla0XJwkKxlJ2VRxI1lA2RlRRWnqVGiRqPmJJXYqKGPEOGYdIwg/Nxzpm55ozByq1v3c6538fve85NSPjvhzcfnPTBYQ3slyP2ymC3Ajx21N7fZN8S4qgKAkO8M4N4HQBvB9w26nXhzIabOX4lc1qHn3WCjMFHJ7w0S4EGvc5JtRYJztviRXRsGTeAU5KH+KALQh0xAsJTiXCXadyN22S6h6iImlk89krX4bCz5f7YKN3qowK6j1IeHLncu+yGgCopNBEmWVBkI75KqMgKgeVCPCMlpkBppLCGWFzXaugC3WF3tovxL+aw05NmCMhF3XaE8AVVXGR2y53NQj1CrIDakEelo5pQsY3o2kgKnI3a2OovigqIg/boxyYsokH2ObJw96fgcXQaAvJI1FxWy3HECPllKY/j4XRW2lIJPXu/3YWLaZ5mM+IcLShnRV5rTcS7O/3zbRSnk5yPpOk0odV87ajeL8czdWxnU+rvZOt5f77haqGZvcECNuzJuNqTcHUX4J5qIei/5d//3k/ScyAkq+CgnAAAAABJRU5ErkJggg==) no-repeat 0px 0px;" border="0">    
  
}
