# SiPlanilla SV — Frontend

Sistema de Gestión de Planillas · Angular 21 · Tailwind CSS · Oracle XE

---

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| Angular CLI | 21+ |

Instalar Angular CLI globalmente si no está instalado:

```bash
npm install -g @angular/cli
```

---

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (abre automáticamente http://localhost:4200)
npm start

# o con Angular CLI
ng serve -o
```

Para compilar en producción:

```bash
ng build
```

Los artefactos quedan en `dist/siplanilla-fronted/`.

---

## Tecnologías

| Librería | Versión | Uso |
|---|---|---|
| Angular | 21 | Framework principal — standalone components, signals |
| Tailwind CSS | 3.4 | Utilidades de layout y espaciado en plantillas |
| @tailwindcss/forms | 0.5 | Reset de estilos para inputs y selects |
| Chart.js | 4.5 | Gráficas (importado, pendiente de implementar) |
| SweetAlert2 | 11 | Alertas y modales de confirmación (pendiente) |
| date-fns | 4.4 | Formateo de fechas (pendiente) |
| RxJS | 7 | Eventos del Router (`NavigationEnd` en Header) |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── app.ts                              ← Componente raíz (solo <router-outlet>)
│   ├── app.html                            ← <router-outlet></router-outlet>
│   ├── app.routes.ts                       ← Todas las rutas de la aplicación
│   ├── app.config.ts                       ← provideRouter, providers globales
│   │
│   └── components/
│       ├── auth/
│       │   ├── login/                      ← Pantalla de login con toggle contraseña
│       │   └── recuperar-password/         ← Stub (pendiente)
│       │
│       ├── layout/
│       │   ├── sidebar/                    ← Sidebar colapsable, 9 ítems de navegación
│       │   ├── header/                     ← Título dinámico + reloj en tiempo real
│       │   └── main-layout/               ← Shell: sidebar + header + <router-outlet>
│       │
│       ├── dashboard/                      ← Stats, barras de presupuesto, tabla recientes
│       │
│       ├── empleados/
│       │   ├── lista-empleados/            ← Tabla con búsqueda y filtros activo/inactivo
│       │   └── form-empleado/             ← Formulario 3 secciones (nuevo / editar)
│       │
│       ├── estructura-organizativa/        ← Árbol expandible 4 niveles con badges por tipo
│       │
│       ├── puestos-salarios/               ← Tabla de puestos con rangos salariales
│       │
│       ├── catalogos/                      ← 5 tabs: Estado Civil, Territorios, AFP, etc.
│       │
│       ├── planilla/
│       │   ├── lista-planillas/            ← Cards expandibles con resumen de planilla
│       │   └── detalle-planilla/           ← Stub (pendiente)
│       │
│       ├── centros-costo/                  ← Selector de año, 3 tarjetas, tabla vacía
│       │
│       ├── boletas-pago/                   ← Selectores empleado/período + preview boleta
│       │
│       ├── empresa/                        ← 3 fieldsets de configuración + preview boleta
│       │
│       └── administracion/
│           ├── usuarios/                   ← Stub (pendiente)
│           └── roles/                      ← Stub (pendiente)
│
├── environments/
│   ├── environment.ts                      ← apiUrl: http://localhost:8080/api
│   └── environment.prod.ts
│
└── styles.css                              ← Tailwind base + design tokens + clases compartidas
```

---

## Sistema de diseño

Los colores del sistema viven en `src/styles.css` como variables CSS. **No usar colores hardcodeados** — referenciar siempre mediante `var(--token)`.

### Variables disponibles

```css
/* Marca */
--primary:             #1e3a5f   /* azul marino — sidebar, encabezados */
--primary-foreground:  #ffffff
--accent-foreground:   #1e40af   /* azul botones y links */
--accent:              #dbeafe   /* azul claro — fondos de acento */
--secondary:           #eff6ff   /* fondos suaves */
--secondary-foreground:#1e3a5f

/* Texto */
--foreground:          #1a1a1a   /* texto principal */
--muted-foreground:    #64748b   /* texto secundario / placeholders */

/* Semánticos */
--destructive:         #d4183d   /* rojo — eliminar, errores */
--destructive-foreground: #ffffff

/* Fondos */
--background:          #ffffff
--muted:               #f1f5f9   /* gris claro — fondo general de la app */
--border:              rgba(0,0,0,0.1)
--input-background:    #f3f3f5

/* Sidebar */
--sidebar-bg:          #1e3a5f
--sidebar-bg-hover:    #16304f
--sidebar-bg-active:   #122744
--sidebar-text:        #bfdbfe
--sidebar-text-active: #ffffff
--sidebar-border:      rgba(255,255,255,0.1)
--sidebar-width:       216px
```

### Clases compartidas (definidas en `styles.css`)

Úsalas directamente en cualquier componente sin redefinirlas:

```html
<!-- Botones -->
<button class="btn btn-primary">Guardar</button>
<button class="btn btn-outline">Cancelar</button>
<button class="btn btn-outline-primary">Editar</button>
<button class="btn btn-danger">Eliminar</button>
<button class="btn btn-ghost">Acción secundaria</button>
<button class="btn btn-primary btn-sm">Tamaño pequeño</button>

<!-- Badges de estado -->
<span class="badge badge-green">Activo</span>
<span class="badge badge-red">Inactivo</span>
<span class="badge badge-blue">Procesada</span>
<span class="badge badge-amber">Pendiente</span>
<span class="badge badge-gray">Borrador</span>

<!-- Tabla -->
<table class="data-table">
  <thead><tr><th>Columna</th></tr></thead>
  <tbody><tr><td>Dato</td></tr></tbody>
</table>

<!-- Formularios -->
<label class="form-label">Campo <span style="color:var(--destructive)">*</span></label>
<input  class="form-input"  type="text" />
<select class="form-select"></select>

<!-- Contenedores -->
<div class="card">...</div>             <!-- card con borde y sombra -->
<div class="stat-card">...</div>        <!-- tarjeta de estadística -->
<div class="page-toolbar">...</div>     <!-- barra superior con título y acciones -->
<p   class="section-label">SECCIÓN</p> <!-- etiqueta de agrupación en formulario -->
```

### Convención de estilos

| Qué | Cómo |
|---|---|
| Colores y tokens | `var(--token)` en CSS del componente |
| Layout estructural | Tailwind (`flex`, `gap-*`, `p-*`, `grid`) en la plantilla |
| Componentes de UI globales | Clases de `styles.css` (`.btn`, `.badge`, `.data-table`, etc.) |
| Estilos únicos de una pantalla | CSS del componente — puro, sin `@apply` |
| Override puntual | `style="color: var(--primary)"` inline |

---

## Rutas configuradas

| Ruta | Componente | Estado |
|---|---|---|
| `/login` | LoginComponent | Visual ✅ |
| `/recuperar-password` | RecuperarPasswordComponent | Stub |
| `/dashboard` | DashboardComponent | Visual ✅ |
| `/empleados` | ListaEmpleadosComponent | Visual ✅ |
| `/empleados/nuevo` | FormEmpleadoComponent | Visual ✅ |
| `/empleados/editar/:id` | FormEmpleadoComponent | Visual ✅ |
| `/estructura-organizativa` | EstructuraOrganizativaComponent | Visual ✅ |
| `/puestos-salarios` | PuestosSalariosComponent | Visual ✅ |
| `/catalogos` | CatalogosComponent | Visual ✅ |
| `/planilla` | ListaPlanillasComponent | Visual ✅ |
| `/planilla/:id` | DetallePlanillaComponent | Stub |
| `/centros-costo` | CentrosCostoComponent | Visual ✅ |
| `/boletas-pago` | BoletasPagoComponent | Visual ✅ |
| `/empresa` | EmpresaComponent | Visual ✅ |
| `/administracion/usuarios` | UsuariosComponent | Stub |
| `/administracion/roles` | RolesComponent | Stub |

> La ruta raíz `/` redirige a `/dashboard` durante desarrollo.
> Al implementar autenticación, cambiar a `/login` en `app.routes.ts` y agregar `AuthGuard`.

---

## Cómo conectar tu módulo al backend

Cada integrante recibe uno o más componentes con diseño visual y datos hardcodeados. El siguiente patrón aplica para conectarlos al backend:

### 1. Modelo TypeScript

```typescript
// src/app/core/models/empleado.model.ts
export interface Empleado {
  idEmpleado: number;
  nombres: string;
  apellidos: string;
  dui: string;
  activo: boolean;
  // ... otros campos según la tabla Oracle
}

// Wrapper que devuelve el backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
```

### 2. Servicio HTTP

```typescript
// src/app/core/services/empleado.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, Empleado } from '../models/empleado.model';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/empleados`;

  getAll() {
    return this.http.get<ApiResponse<Empleado[]>>(this.base);
  }

  getById(id: number) {
    return this.http.get<ApiResponse<Empleado>>(`${this.base}/${id}`);
  }

  create(empleado: Partial<Empleado>) {
    return this.http.post<ApiResponse<Empleado>>(this.base, empleado);
  }

  update(id: number, empleado: Partial<Empleado>) {
    return this.http.put<ApiResponse<Empleado>>(`${this.base}/${id}`, empleado);
  }
}
```

### 3. Componente con señales

```typescript
// En el componente (reemplazar datos hardcodeados)
private empleadoService = inject(EmpleadoService);
empleados = signal<Empleado[]>([]);
cargando = signal(false);

ngOnInit() {
  this.cargando.set(true);
  this.empleadoService.getAll().subscribe({
    next: res => {
      this.empleados.set(res.data);
      this.cargando.set(false);
    },
    error: () => this.cargando.set(false)
  });
}
```

### 4. Habilitar HttpClient (una sola vez, en `app.config.ts`)

```typescript
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // ← agregar
  ]
};
```

---

## API Backend

| Detalle | Valor |
|---|---|
| URL base (dev) | `http://localhost:8080/api` |
| Swagger UI | `http://localhost:8080/api/swagger-ui.html` |
| CORS habilitado | `http://localhost:4200` |
| Autenticación | Sin JWT por ahora |

Estructura estándar de respuesta:

```json
{
  "success": true,
  "message": "OK",
  "data": [],
  "timestamp": "2026-06-13T10:00:00"
}
```

---

## Estado del proyecto

### Completado ✅

- [x] Proyecto Angular 21 configurado (standalone, sin NgModules)
- [x] Tailwind CSS v3 + @tailwindcss/forms
- [x] Environments con `apiUrl` apuntando al backend
- [x] Sistema de diseño — variables CSS completas según Figma
- [x] Layout principal: Sidebar colapsable + Header con reloj en tiempo real
- [x] Routing completo (16 rutas)
- [x] 11 pantallas con diseño visual y datos de ejemplo:
  - Login, Dashboard, Lista Empleados, Formulario Empleado
  - Estructura Organizativa, Puestos y Salarios, Catálogos (5 tabs)
  - Lista Planillas, Centros de Costo, Boletas de Pago, Empresa

### Pendiente — fase de integración ⏳

- [ ] Activar `HttpClient` en `app.config.ts`
- [ ] Crear `core/models/` con interfaces por módulo
- [ ] Crear `core/services/` con servicios HTTP por módulo
- [ ] Reemplazar datos hardcodeados por llamadas al backend
- [ ] `AuthGuard` + interceptor JWT (cuando backend implemente seguridad)
- [ ] Login funcional
- [ ] Detalle Planilla (`/planilla/:id`), Usuarios, Roles (stubs activos)
- [ ] Modales de confirmación para eliminar registros
