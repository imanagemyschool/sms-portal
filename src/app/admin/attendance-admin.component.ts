import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import {NgbTabsetConfig, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {GridOptions} from 'ag-grid/main';


@Component({
  moduleId: module.id,
  templateUrl: 'attendance-admin.component.html'
})

export class AttendanceAdminComponent implements OnInit{

  gridOptions:GridOptions;
  selectedSchoolClassCode:string;

  constructor() {
    this.gridOptions = <GridOptions>{};
  }

  ngOnInit(): void {
  }

}