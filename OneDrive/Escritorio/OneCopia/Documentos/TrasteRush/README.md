# TrasteRush

TrasteRush es una aplicacion web para la gestion y alquiler de trasteros. El proyecto esta preparado para ejecutarse en local con Angular y consumir una API externa configurada en los archivos de entorno.

## Tecnologias

- Angular 21
- TypeScript
- Angular Material / CDK
- Firebase
- Express y Angular SSR
- npm

## Estructura del proyecto

```text
TrasteRush/
+-- Backend/
`-- TrasteRush/
    +-- public/
    +-- src/
    +-- angular.json
    +-- package.json
    `-- README.md
```

- `Backend/`: carpeta reservada para el backend local.
- `TrasteRush/`: aplicacion Angular.
- `TrasteRush/src/app/pages/`: paginas principales de la aplicacion.
- `TrasteRush/src/app/services/`: servicios de comunicacion con la API.
- `TrasteRush/src/environments/`: configuracion de entornos.

## Requisitos

Antes de ejecutar el proyecto en local necesitas tener instalado:

- Node.js
- npm
- Angular CLI

Puedes comprobarlo con:

```powershell
node -v
npm -v
ng version
```

Si no tienes Angular CLI instalado:

```powershell
npm install -g @angular/cli
```

## Instalacion local

Desde PowerShell, entra en la carpeta del proyecto:

```powershell
cd C:\Users\rafag\OneDrive\Escritorio\OneCopia\Documentos\TrasteRush\TrasteRush
```

Instala las dependencias:

```powershell
npm install
```

## Ejecutar en desarrollo

Para levantar la aplicacion en local:

```powershell
npm start
```

Tambien puedes usar:

```powershell
ng serve
```

Cuando termine de compilar, abre:

```text
http://localhost:4200
```

## Configuracion de la API

La URL de la API esta configurada en:

```text
TrasteRush/src/environments/environment.ts
TrasteRush/src/environments/environment.prod.ts
```

Actualmente apunta a:

```text
http://dev2.datarush.es/BackTrasteRush/api
```

Si quieres usar un backend local, cambia `URL_BASE` por la ruta local de tu API. Por ejemplo:

```ts
export const URL_BASE = 'http://localhost/BackTrasteRush';
export const URL_API = `${URL_BASE}/api`;
```

## Rutas principales

La aplicacion incluye estas pantallas:

- `/`: pagina principal
- `/login`: inicio de sesion
- `/admin`: panel de administracion
- `/users`: listado de usuarios
- `/edit-user/:id`: edicion de usuario
- `/rent`: alquiler de trasteros
- `/contact`: contacto
- `/user-page`: area de usuario
- `/pequeno`: trastero pequeno
- `/mediano`: trastero mediano
- `/grande`: trastero grande

## Scripts disponibles

Dentro de la carpeta `TrasteRush/TrasteRush` puedes ejecutar:

```powershell
npm start
```

Arranca el servidor de desarrollo.

```powershell
npm run build
```

Genera la version compilada en `dist/`.

```powershell
npm run watch
```

Compila en modo observacion para desarrollo.

```powershell
npm test
```

Ejecuta los tests del proyecto.

```powershell
npm run serve:ssr:traste-rush
```

Ejecuta la version SSR compilada.

## Compilar para produccion

```powershell
npm run build
```

Los archivos generados quedaran en:

```text
TrasteRush/TrasteRush/dist/
```

## Notas

- La autenticacion guarda datos como `token`, `rol`, `id_usuario` y `nombre` en `localStorage`.
- Algunas llamadas usan la API externa directamente. Si el backend se mueve a local, revisa tambien los servicios dentro de `src/app/services/`.
- La carpeta `Backend/` no contiene archivos detectados actualmente, por lo que el arranque local documentado corresponde al frontend Angular.
