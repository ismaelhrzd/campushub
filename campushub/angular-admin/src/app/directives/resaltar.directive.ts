import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

// Directiva de atributo personalizada: <tr [appResaltar]="lab.estado === 'mantenimiento'">
@Directive({ selector: '[appResaltar]', standalone: true })
export class ResaltarDirective implements OnChanges {
  @Input('appResaltar') activo = false;
  private el = inject(ElementRef<HTMLElement>);

  ngOnChanges(): void {
    this.el.nativeElement.classList.toggle('resaltado-mantenimiento', this.activo);
  }
}
