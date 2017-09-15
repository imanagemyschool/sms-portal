import { Component,NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent, SchoolHomeComponent }     from './home/index';
import { ParentComponent, SubjectHyperlinkComponent, PaymentComponent }   from './parent/index';
import { AttendanceAdminComponent}   from './admin/index';
import { StudentEnrollmentComponent }   from './student/index';
import { LoginModalComponent }    from './login/index';
import { HomeService, AuthenticationService, StudentService, UserService, FeeService }    from './services/index';
import { routing }        from './app-routing.module';
import { AppComponent }  from './app.component';
import {AgGridModule} from 'ag-grid-ng2/main';
import { AuthGuard } from './guards/index';

@NgModule({
  imports: [ BrowserModule, 
             FormsModule, 
             HttpModule, 
             ReactiveFormsModule, 
             JsonpModule, 
             NgbModule.forRoot(),
             routing,
             AgGridModule.withComponents([ParentComponent, SubjectHyperlinkComponent])      
  ],
  declarations: [ AppComponent,
                  LoginModalComponent,
                  HomeComponent,
                  ParentComponent,
                  SchoolHomeComponent,
                  SubjectHyperlinkComponent,
                  AttendanceAdminComponent,
                  StudentEnrollmentComponent,
                  PaymentComponent
  ],
  providers: [ AuthGuard,
               HomeService,
               AuthenticationService,
               StudentService,
               UserService,
               FeeService
  ],
  
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
