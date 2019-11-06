import { Component, OnInit } from '@angular/core';
import { ViewSample } from '../../interfaces/view-sample';
import { ViewTestService } from '../../services/view-test.service';

@Component({
  selector: 'app-view-tests',
  templateUrl: './view-tests.component.html',
  styleUrls: ['./view-tests.component.scss']
})
export class ViewTestsComponent implements OnInit {
    tests: ViewSample[];
    errorMessage: string;

  constructor(private viewTestService: ViewTestService) { }

  getTests() {
      this.viewTestService.tests().subscribe({
          next: (testArray) => {
              this.tests = testArray;
              this.errorMessage = undefined;
          },
          error: (er) => {
              console.log(er);
              this.errorMessage = 'Unable to load  view test list.';
              this.tests = [];
          }
      });
  }

  ngOnInit() {
      this.getTests();
  }

}
