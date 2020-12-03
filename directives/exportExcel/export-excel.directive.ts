import { Directive, HostListener, Input } from '@angular/core';

import * as XLSX from 'xlsx';

@Directive({
  selector: '[pfepExportExcel]'
})
export class ExportExcelDirective {
  @Input() config;
  constructor() {}
  @HostListener('click', ['$event'])
  onclick(event) {
    let blob;
    const wb = { SheetNames: [], Sheets: {} };
    // const vm = this.config;
    this.config.data.forEach((element, index) => {
      const ObjHeaders = this.config.coloumns[index].coloumns;
      const ObjData = element.data;
      wb.SheetNames.push(this.config.sheetNames[index]);
      wb.Sheets[this.config.sheetNames[index]] = XLSX.read(
        this.prepareTable(ObjData, ObjHeaders),
        { type: 'binary', cellStyles: true }
      ).Sheets.Sheet1;
    });
    blob = new Blob(
      [
        this.s2ab(
          XLSX.write(wb, { bookType: 'xlsx', type: 'binary', cellDates: true, cellStyles: true })
        )
      ],
      {
        type: 'application/octet-stream'
      }
    );
    XLSX.writeFile(wb, `${this.config.fileName}.xlsx`);
  }
  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) && 0xff;
    }
    return buf;
  }
  prepareTable = (data, header) => {
    const html = [];
    html.push('<html><head>');
    html.push('<style type=“text/css”>');
    html.push('tr th {');
    html.push('text-align: center;');
    html.push('font-weight: bold;');
    html.push('color: red;');
    html.push('}');
    html.push('</style>');
    html.push('</head><body><table>');
    html.push('<tr>');
    header.forEach(function(d) {
      html.push('<th style="font-weight:bold"><b>' + d['title'] + '</b></th>');
    });
    html.push('</tr>');
    data.forEach(function(element, index) {
      html.push('<tr>');
      header.forEach(function(d) {
        if (element[d.field] !== undefined) {
          html.push('<td>' + element[d.field] + '</td>');
        }
      });
      html.push('</tr>');
    });
    html.push('</table>');
    html.push('</body></html>');
    return html.join(' ');
  }
}
