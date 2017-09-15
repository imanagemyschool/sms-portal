import {Component} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-ng2/main';
import {NgbModal, ModalDismissReasons, NgbModalOptions, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { StudentService }  from './../services/index';
import { StudentCategoryGrade, SubjectCategory }  from './../models/index';
import {GridOptions} from 'ag-grid/main';

@Component({
    selector: 'clickable-cell',
    template: `
    <template #content let-c="close" let-d="dismiss">
    <div class="modal-header">
      <h4 class="modal-title">{{getModalHeaderText()}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
              <ag-grid-ng2 #categoryagGrid style="width: 100%; height: 350px;" class="ag-material"
                     [gridOptions]="subjectCategoryGradesGridOptions"
                     enableColResize
                     enableSorting
                     enableFilter
                     rowHeight="50">
              </ag-grid-ng2>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>    
    </template>     
    <a href="javascript:void(0)" (click)="getSubjectCategoryGradeDetails(content)">{{getSubjectDescription()}}</a>
    `
})



export class SubjectHyperlinkComponent implements AgRendererComponent {
    private params:any;
    public cell:any;
    closeResult: string;    
    studentCategoryGrades: StudentCategoryGrade[];
    subjectCategoryGradesGridOptions:GridOptions;
    modalInstance:NgbActiveModal;

    constructor(private modalService: NgbModal,
              private studentService: StudentService) {
        this.subjectCategoryGradesGridOptions = <GridOptions>{};
    }    

    agInit(params:any):void {
        this.params = params;
        this.cell = {row: params.data.subjectDescription, col: params.colDef.headerName};
    }

    getSubjectDescription():any {
        return this.params.data.subjectDescription;
    }

    private getModalHeaderText():any {
        return this.params.data.subjectDescription + ' - ' + this.params.data.termDescription;
    }

    getSubjectCategoryGradeDetails(content) {
        this.studentService.getStudentCategoryGrades(this.params.data.studentId, this.params.data.termCode, this.params.data.subjectCode).then(studentCategoryGrades => {
            for(let studentCategoryGrade of studentCategoryGrades){
                studentCategoryGrade.subjectCategoryDescription = this.getSubjectCategoryDescription(studentCategoryGrade)
            }
            this.studentCategoryGrades = studentCategoryGrades

            var options: NgbModalOptions = {size:"lg"};
            this.modalInstance = this.modalService.open(content, options)

            this.subjectCategoryGradesGridOptions.rowData=studentCategoryGrades;
            this.subjectCategoryGradesGridOptions.columnDefs= this.getColumnDefs();
        })
    }    

    private getColumnDefs() {
        return [
            {headerName: "Description", field: "categoryItemDescription", width:300, filter: 'text'}, 
            {headerName: "Type", field: "categoryItemType", width:150, filter: 'text'},
            {headerName: "Category", field: "subjectCategoryDescription", width:218, filter: 'text'},
            {headerName: "Score", field: "categoryItemScore", width:100, filter: 'text'},
            {headerName: "Percentage", field: "categoryItemPercentage", width:100, filter: 'text'}
       ];
    }

    private getSubjectCategoryDescription(studentCategoryGrade: StudentCategoryGrade): any{
        var subjectCategories = JSON.parse(localStorage.getItem('subjectCategories'));
        for(let subjectCategory of subjectCategories){
            if(subjectCategory.subjectCategoryCode == studentCategoryGrade.subjectCategoryCode) return subjectCategory.subjectCategoryDescription
        }
        return "";
    }    

    private closeModal(){
        this.modalInstance.close();
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