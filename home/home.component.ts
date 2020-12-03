import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/services/share.service';
import * as constants from './constants';

@Component({
  selector: 'pfep-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export  class HomeComponent implements OnInit {
  constructor(public sharedService: SharedService) { }
  ngOnInit() {

  }

  routeAttachedFn = () => {
    const reqData = this.sharedService.getCbReqData();
    if(Object.keys(reqData).length > 0) {
      const route = reqData['parentScreenPath'].split('/');
      if(constants.alertScreenPaths.indexOf(route[route.length - 1]) > -1) {
        this.sharedService.routeAttached(route[route.length - 1]);
      }
    }
  }

  debounce = (func, timeOut) => {
    let delay;
    return (...rest) => {
      const context = this;
      const later = () => {
        delay = null;
        func.apply(context, rest);
      };
      clearTimeout(delay);
      delay = setTimeout(later, timeOut);
    };
  }

  debounceRouteAttached = this.debounce(this.routeAttachedFn, 1000);

  routeAttached = () => {
    this.debounceRouteAttached();
  }
}
