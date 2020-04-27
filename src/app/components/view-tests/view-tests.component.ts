import { Component, OnInit } from '@angular/core';
import { ViewSample } from '../../interfaces/view-sample';
import { ViewTestService } from '../../services/view-test.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-tests',
  templateUrl: './view-tests.component.html',
  styleUrls: ['./view-tests.component.scss']
})
export class ViewTestsComponent implements OnInit {
    tests: ViewSample[];

  constructor(
      private viewTestService: ViewTestService,
      private toasterService: ToastrService) { }

  getTests() {
      this.viewTestService.tests().subscribe({
          next: (testArray) => {
              this.tests = testArray;
          },
          error: (err) => {
              console.log(err);
              this.toasterService.error(err, 'Initialization Error');
              this.tests = [];
          }
      });
  }

  ngOnInit() {
      this.getTests();
  }

}
