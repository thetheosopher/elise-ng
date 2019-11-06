import { Component, OnInit } from '@angular/core';
import { DesignSample } from '../../interfaces/design-sample';
import { DesignTestService } from '../../services/design-test.service';

@Component({
  selector: 'app-design-tests',
  templateUrl: './design-tests.component.html',
  styleUrls: ['./design-tests.component.scss']
})
export class DesignTestsComponent implements OnInit {
    tests: DesignSample[];
    errorMessage: string;

  constructor(private _designTestService: DesignTestService) { }

  getTests() {
      this._designTestService.tests().subscribe({
          next: (testArray) => {
              this.tests = testArray;
              this.errorMessage = undefined;
          },
          error: (er) => {
              console.log(er);
              this.errorMessage = 'Unable to load design test list.';
              this.tests = [];
          }
      });
  }

  ngOnInit() {
      this.getTests();
  }

}
