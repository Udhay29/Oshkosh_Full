import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[numberOnly]'
})
export class NumberOnlyDirective {
    // Allow decimal numbers and negative values
    private regex: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}$/g);
    private regexInteger: RegExp = new RegExp(/^[0-9]*$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right'];
    @Input() numberOnly = 'false';
    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        const current: string = this.el.nativeElement.value;
        const next = (event.key === '.' || event.key === 'Decimal') ? current.concat('.') : current.concat(event.key);
        if (this.numberOnly === 'true') {
            if (next && !String(next).match(this.regexInteger)) {
                event.preventDefault();
            }
        } else {
            if (next && !String(next).match(this.regex)) {
                event.preventDefault();
            }
        }
    }
}
