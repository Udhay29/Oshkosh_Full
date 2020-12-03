import { Injectable } from '@angular/core';
import {
  pfepRequired,
  pfepShortage,
  pfepMOQCeiling,
  pfepDemandGap,
  pfepERPAlert
} from './constants';
@Injectable()
export class DashboardUtilsService {
  constructor() { }

  constructGraphJson(data, label) {
    data.forEach(element => {
      const date = new Date(element.Week_Start_Date);
      element.name = date.getMonth() + 1 + '/' + date.getDate();
      element.series = this.removeSeriesData(element.series);
    });
    data.label = label;
    return data;
  }

  constructERPAlertGraphJson(data, label) {
    data.forEach(element => {
      element.name = element.Name;
      element.series = this.removeSeriesData(element.series);
    });
    data.label = label;
    return data;
  }

  removeSeriesData(seriesArray) {
    return seriesArray.filter(obj => obj.value !== 0);
  }

  formatDate(date) {
    if (date !== null && date !== undefined && date !== '') {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) { month = '0' + month; }
      if (day.length < 2) { day = '0' + day; }

      return [year, month, day].join('-');
    } else {
      return '';
    }
  }

  setFromDate(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - 56);
    console.log(d);
    return d;
  }



  getDateLimit = (limitType, d) => {
    const date = new Date(d);
    const offSetDate = limitType === 'toDate' ? 1 : -1;
    date.setDate(date.getDate() + offSetDate);
    return date;
  }

  setScreenName(eve) {
    switch (eve) {
      case 'PFEP Over/Under Planned':
        return pfepShortage;
      case 'MOQ Ceiling':
        return pfepMOQCeiling;
      case 'PFEP Required':
        return pfepRequired;
      case 'Demand Gaps':
        return pfepDemandGap;
      case 'ERP Discrepancy Alert':
        return pfepERPAlert;
    }
  }
}
