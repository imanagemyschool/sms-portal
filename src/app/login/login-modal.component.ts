import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { NgbModal, ModalDismissReasons }       from '@ng-bootstrap/ng-bootstrap';
import { HomeService, AuthenticationService }  from './../services/index';
import { User, UserSchool, School }            from './../models/index';

@Component({
  selector: 'login-modal',
  templateUrl: 'login-modal.component.html'
})

export class LoginModalComponent {
  emailUsername: string;
  password: string;
  user: User;
  userschoolList: UserSchool[];
  selectedUserSchoolCode: string;
  closeResult: string;
  

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private homeService: HomeService,
              private modalService: NgbModal) {}

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // This method will validate the username (email address) and display the school info and user type to the user so that they can select 
  // those to login to the right application (i.e parent portal, admin, faculty etc.)
  validateUsername(): void {

    // Get the User record based on the username
    this.homeService
        .getUser(this.emailUsername)
        .then(userResult => {
            this.user = userResult

            // Get the user school information for the userId. There could be multiple records for the same username.  
            this.homeService
              .getUserSchool(this.user.userId)
              .then(userSchoolResult => {
                  this.userschoolList = userSchoolResult
                  for (let userschool of this.userschoolList) {
                      this.homeService
                          .getSchool(userschool.schoolCode)
                          .then(school => {
                              userschool.schoolDescription = school.schoolName;
                          }) 
                  }
                  this.selectedUserSchoolCode = this.userschoolList[0].schoolCode;
            });          
        });
  }


  loginUser(): void {
      this.authenticationService.login(this.emailUsername, this.password, this.selectedUserSchoolCode, this.getSelectedUserTypeCode(this.selectedUserSchoolCode))
          .subscribe(
                data => {
                    this.router.navigate(['/schoolhome']);
                },
                error => {
                    //this.alertService.error(error);
                    //this.loading = false;
                }
          );
  }


  setSelectedUserSchoolCode(selectedSchoolCode: any): void{
    this.selectedUserSchoolCode=selectedSchoolCode;
  }
  
  getSelectedUserTypeCode(selectedSchoolCode: any): string{
    for (let userschool of this.userschoolList) {
      if(userschool.schoolCode == selectedSchoolCode) return userschool.userTypeCode;
    }

    return ""
  }  


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
