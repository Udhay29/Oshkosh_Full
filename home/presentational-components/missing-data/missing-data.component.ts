// presentational component for the missing data table (single row 3 column)

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pfep-missing-data',
  templateUrl: './missing-data.component.html',
  styleUrls: ['./missing-data.component.scss']
})
export class MissingDataComponent implements OnInit {

  @Input() values: any = {};
  @Input() Approvals:any = {};
  @Output() tile = new EventEmitter();

  constructor() { }
  
  ngOnInit() {
  }

  missingDataTileClicked = tileParam => {
    this.tile.emit(tileParam);
  }
}
