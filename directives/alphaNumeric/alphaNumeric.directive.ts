import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
 selector: '[alphaNumericOnly]'
})
export class AlphaNumericDirective {
 
 private regex: RegExp = new RegExp(/^[a-zA-Z0-9]*$/);
 // Allow key codes for special events. Reflect :
 // Backspace, tab, end, home
 private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown' ];

constructor(private el: ElementRef) {
 }
 @HostListener('keydown', [ '$event' ]) onKeyDown(event: KeyboardEvent) {
 // Allow Backspace, tab, end, and home keys
 if (this.specialKeys.indexOf(event.key) !== -1) {
 return;
 }
 const current: string = this.el.nativeElement.value;
 const next: string = current.concat(event.key);
 if (next && !String(next).match(this.regex)) {
 event.preventDefault();
 }
 }
}
