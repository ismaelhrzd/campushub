import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador propio basado en expresión regular.
// Uso: validadorRegex(/^Lab [A-Z]-\d{3}$/, 'formatoNombre')
export function validadorRegex(patron: RegExp, clave: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (valor === null || valor === undefined || valor === '') return null; // lo cubre `required`
    return patron.test(String(valor)) ? null : { [clave]: true };
  };
}
