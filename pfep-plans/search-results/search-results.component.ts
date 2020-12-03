
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'pfep-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  @Input() data;
  @Input() feilds;
  @Output() rowClick = new EventEmitter<any>();
  selectedRow: any;
  selectedDataRow: any = {};
  first: any;
  constructor() {}
ngOnInit() {
console.log(this.feilds,this.data);
}

ngOnChanges(changes) {
  if(changes.data) {
    this.first = 0;
  }
}
onRowSelect(e, item) {
   e.preventDefault();
   this.selectedRow = item.ITEM_ID;
   this.rowClick.emit(item);
  }
  pageChange(e) {
    this.first = e.first;
  }
}
