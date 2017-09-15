import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParentComponent, PaymentComponent }  from './parent/index';
import { HomeComponent, SchoolHomeComponent } from './home/index';
import { StudentEnrollmentComponent }  from './student/index';
import { AppComponent }      from './app.component';
import { AuthGuard } from './guards/index';

const appRoutes: Routes = [
     { path: '', component: HomeComponent },
     { path: 'schoolhome', component: SchoolHomeComponent, canActivate: [AuthGuard] },
     { path: 'parent', component: ParentComponent, canActivate: [AuthGuard] },
     { path: 'studentenrollment', component: StudentEnrollmentComponent, canActivate: [AuthGuard] },
     { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] }

];

export const routing = RouterModule.forRoot(appRoutes);
