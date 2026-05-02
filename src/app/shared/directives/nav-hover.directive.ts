import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { HostListener } from '@angular/core';

@Directive({
  selector: '[appNavHover]',
  standalone: true
})
export class NavHoverDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'background-color 0.3s ease'
    )
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      '#00ffff4b'
    );

    this.renderer.setStyle(
      this.el.nativeElement,
      'cursor',
      'pointer'
    );
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.removeStyle(
      this.el.nativeElement,
      'backgroundColor'
    )
  }

}
