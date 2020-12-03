import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[elementDisabled]'
})

export class ElementDisabledDirective {

  private _el: HTMLElement;

  @Input() set elementDisabled(disabled: boolean) {
    this._el['disabled'] = disabled ? true : null;
    if (!disabled) {
      this._el.focus();
    }
    this._el.classList.add('disabled');
  }

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
  }



}