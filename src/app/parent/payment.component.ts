import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { Router }      from '@angular/router';
import { JSONSerializationUtils } from './../utils/index';
import { User } from './../models/index';
import { Student, StudentFee, FeeType, Fee }  from './../models/index';
import { StudentService, FeeService }  from './../services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'payment.component.html'
})

export class PaymentComponent implements OnInit{

  students: Student[]; 
  studentFees: StudentFee[];
  feeList: Fee[];
  feeType: FeeType;
  userId: number; 
  selectedStudentId: number;

  constructor(private studentService: StudentService, private feeService: FeeService) {
  }

  ngOnInit(): void {
      let user = JSONSerializationUtils.toInstance(new User, localStorage.getItem('currentUser'))
      this.userId = user.userId
      this.getStudents(user.userId);          
  }


  private getStudents(userId: number): void {
      this.studentService.getStudents(userId).then(students => {
          this.students = students
      })
  }
    
  getStudentFees(): void {
      let feeList = [];
      this.studentService.getStudentFees(this.selectedStudentId).then(studentFees => {
          this.studentFees = studentFees
          for(let studentFee of this.studentFees){
            this.feeService.getFeeTypes(studentFee.feeTypeCode).then(feeType => {
                this.feeType = feeType;

                let fee = new Fee
                fee.studentId=this.selectedStudentId;
                fee.feeTypeCode=feeType.feeTypeCode;
                fee.feeTypeDescription=feeType.feeTypeDescription;
                fee.feeAmount=feeType.feeAmount;
                feeList.push(fee)
            })            
          }
      })
      this.feeList=feeList;
      console.log("this.feeList", feeList)

  }    

}