import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'pfep-pfep-required',
  templateUrl: './pfep-required.component.html',
  styleUrls: ['./pfep-required.component.scss']
})
export class PfepRequiredComponent implements OnInit {
  @Input() data;
  @Input() feilds;
  @Input() isEditable;

  selectedDataRow: any = {};

  constructor( ) {}
  ngOnInit() {}



}
