import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { Router }      from '@angular/router';
import { User, RoleAttribute } from './../models/index';
import { UserService }  from './../services/index';
import { JSONSerializationUtils } from './../utils/index';

@Component({
  moduleId: module.id,
  templateUrl: 'schoolhome.component.html'
})

export class SchoolHomeComponent implements OnInit{

  roleAttributes: RoleAttribute[];
  hasParentPortalPermission: Boolean;
  hasStudentEnrollmentPermission: Boolean;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
      let user = JSONSerializationUtils.toInstance(new User, localStorage.getItem('currentUser'))
      this.setUserRoleAttributes(user.userId)
  }

  private setUserRoleAttributes(userId: number): void {
      this.userService.getUserRoleAttributes(userId).then(roleAttributes => {
          this.roleAttributes = roleAttributes
          for(let roleAttribute of this.roleAttributes){
              if(roleAttribute.attributeName == 'ParentPortalUser')       this.hasParentPortalPermission      = true;
              else if(roleAttribute.attributeName == 'StudentEnrollment') this.hasStudentEnrollmentPermission = true;
          }
      })
  }

}