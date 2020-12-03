import {Directive, Input, ElementRef} from '@angular/core';

@Directive({
    selector:'[elementFocus]'
  })
  
  export class ElementFocusDirective{
   
    private _el:HTMLElement;
    
    @Input() set elementFocus(focus: boolean) {
      if(focus){
        this._el.focus();
      }
      
    }
    
    constructor(el: ElementRef) { 
      this._el = el.nativeElement;
    }
   
   
   
  }