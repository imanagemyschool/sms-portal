import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';


@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'home.component.html'
})


export class HomeComponent implements OnInit{

  ngOnInit(): void {
    //this.loginUser();
  }
}
