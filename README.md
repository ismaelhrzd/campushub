# CampusHub · Proyecto Integral de JavaScript Avanzado

Sistema web para reservar laboratorios del campus. Un solo API REST consumido por cuatro frontends
(Angular, React, Vue y Next.js); en el avance 5 el backend migra de json-server a Express con JWT.

> **Estado: Avance 1 (semana 13)** · tag `avance-1`

## Integrantes

| Integrante | Usuario de GitHub |
|---|---|
| _Nombre 1_ | _@usuario1_ |
| _Nombre 2_ | _@usuario2_ |
| _Nombre 3_ | _@usuario3_ |

## Dominio elegido

CampusHub Labs (caso base): catálogo = **laboratorios**, transacción = **reservas**.
Regla de negocio mínima: no se cruzan dos reservas del mismo laboratorio en el mismo horario.

> Si el grupo eligió otro dominio de la tabla del enunciado, reemplazar aquí y en el código.

## Estructura

```
campushub/
├── README.md
├── core-js/          núcleo JS reutilizable (validadores, modelos, estadísticas, pruebas)
├── api-mock/         json-server + db.json + colección de Thunder Client/Postman
└── angular-admin/    panel del administrador (Angular 18, Bootstrap)
```

## Requisitos

Node.js LTS (22 recomendado), npm, Git y VS Code.

## Cómo ejecutar cada módulo

Abrir una terminal por módulo.

### 1. core-js (pruebas)

```bash
cd core-js
node --test
```

Resultado esperado: 16 pruebas, 16 pasan.

### 2. api-mock (puerto 3000)

```bash
cd api-mock
npm install
npm run api
```

Probar en el navegador: http://localhost:3000/laboratorios.
La colección `thunder-collection_campushub-avance1.json` se importa en Thunder Client
(Collections → ⋮ → Import) o en Postman.

### 3. angular-admin (puerto 4200)

```bash
cd angular-admin
npm install
npm start        # copia core-js a src/core y levanta ng serve
```

Abrir http://localhost:4200 (con el API encendido en el puerto 3000).

> Si en la PC del laboratorio no se pueden instalar paquetes globales, todo funciona con `npm`/`npx`
> (no se necesita Angular CLI global: está como dependencia del proyecto).

## Qué cubre el Avance 1

| Requisito | Dónde |
|---|---|
| Validadores con expresiones regulares y mensajes con template literals | `core-js/validadores.js` |
| Clases `Usuario`, `Laboratorio`, `Reserva` (`duracionHoras`, `seCruzaCon`) | `core-js/modelos.js` |
| `reduce`, `Map`, `Set`, `sort` + spread y generador de códigos con closure + `padStart` | `core-js/estadisticas.js` |
| 16 pruebas con `node:test` y `assert` | `core-js/core.test.js` |
| `db.json` (2 admins, 6 estudiantes, 8 laboratorios, 20 reservas con los 3 estados), `npm run api`, colección de pruebas | `api-mock/` |
| Componentes: navbar, lista, detalle, formulario y lista de reservas | `angular-admin/src/app/components/` |
| Rutas `/laboratorios`, `/laboratorios/nuevo`, `/laboratorios/:id/editar`, `/reservas` | `app.routes.ts` |
| Servicio con `HttpClient` e interfaces TypeScript | `services/`, `models/modelos.ts` |
| Formulario reactivo con validadores (requeridos, rango y validador propio con regex) | `lab-form.component.ts`, `validators/regex.validator.ts` |
| `@for` / `@if`, `ngClass` para colorear estados | componentes |
| Pipe personalizado `estadoReserva` y directiva `appResaltar` | `pipes/`, `directives/` |
| Bootstrap | `angular.json` (estilos) |

### Reutilización de core-js en Angular

`npm run sync-core` copia `core-js/` a `angular-admin/src/core` (script multiplataforma) y
`tsconfig.json` tiene `"allowJs": true`. La carpeta `src/core` está versionada para que el proyecto
levante aunque no se ejecute el script; si se modifica `core-js`, volver a ejecutar `npm run sync-core`.

## Credenciales de prueba (db.json)

| Rol | Correo | Contraseña |
|---|---|---|
| admin | admin1@utp.edu.pe | admin123 |
| estudiante | u20231234@utp.edu.pe | est123 |

Los códigos de administrador usan el formato `U` + 8 dígitos (`U00000001`) para cumplir la misma
validación que los de los estudiantes.

## Uso de IA

Parte del código base de este avance fue generada con ayuda de IA (Claude). Cada integrante debe poder
explicarlo línea por línea en la sustentación.

## Flujo de trabajo en el laboratorio

El código vive en GitHub y se clona al inicio de cada sesión; las PC pueden restaurarse al reiniciar.
Cada integrante hace commits con su propia cuenta.

```bash
git clone <url-del-repositorio>
git tag avance-1 && git push --tags     # al terminar el avance
```
