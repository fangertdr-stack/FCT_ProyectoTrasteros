import { provideAuth } from '@angular/fire/auth';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TrasteroService } from '../../services/trasteroService';
import { LoginService } from '../../services/loginService';
import { NavigationService } from '../../services/navigation';

@Component({
  selector: 'app-rent-page',
  imports: [
    MatOption,
    MatLabel,
    MatFormField,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './rent-page.html',
  styleUrls: ['./rent-page.css']
})
export class RentPage implements OnInit {

  //creo variables para almacenar los datos del formulario
  duracionSeleccionada: number = 1;
  tamanioSeleccionado: string = 'pequeño';
  aceptaNormas: boolean = false;
  contratoAbierto: boolean = false;

  codigoPago!: number;
  codigoGeneradoVisible = false;
  trasteroAsignado: number | null = null;

  usuario: any = null;

  nombre: string = '';
  apellidos: string = '';
  dni: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private trasteroService: TrasteroService,
    private login: LoginService,
    private nav: NavigationService,
    private cdr: ChangeDetectorRef
  ) { }

  showMessage(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error']
    });
  }

  // Método para verificar si estamos en el navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }


  // Propiedad para verificar si el usuario está logueado
  get isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }

  // Método para cargar los datos del usuario al iniciar el componente
  ngOnInit() {
    if (!this.isLoggedIn) {
      this.showMessage("Debes iniciar sesión para alquilar un trastero");
      this.router.navigate(['/login']);
      return;
    }

    // Escuchar cambios en los parámetros de la URL para actualizar el tamaño seleccionado
    this.route.queryParams.subscribe(params => {
      if (params['tamanio']) {
        this.tamanioSeleccionado = params['tamanio'];
      }
    });

    // Cargar el nombre del usuario para mostrarlo en la interfaz
    this.nombre = this.login.getNombrePublico();
    this.cdr.detectChanges();

    // Obtener el ID del usuario desde el token JWT y cargar sus datos desde el backend
    const token = localStorage.getItem('token');
    const user = this.login.getUserFromToken();
    const idUsuario = user?.id_usuario;

    // Depuracion para mostrar el token, el usuario decodificado y el ID extraído
    // console.log('TOKEN RAW:', token);
    // console.log('DECODE:', user);
    // console.log('ID desde JWT:', idUsuario);

    if (!idUsuario) {
      this.showMessage("Sesión no válida");
      this.router.navigate(['/login']);
      return;
    }

    // Cargar los datos completos del usuario desde el backend usando el ID extraido
    this.trasteroService.getUsuario(idUsuario).subscribe({
      next: (res) => {
        console.log('Respuesta backend usuario:', res);

        // Validar la respuesta del backend para asegurarnos de que contiene los datos esperados
        if (!res || res.success === false) {
          console.warn('Usuario no encontrado:', res);
          this.showMessage("No se pudieron cargar los datos del usuario");
          return;
        }


        const data = res.data ?? res;

        // Validar que los datos del usuario contienen el ID necesario para continuar
        if (!data || !data.id_usuario) {
          console.warn('Respuesta de usuario inválida:', data);
          this.showMessage("No se pudieron cargar los datos del usuario");
          return;
        }

        //almaceno los datos del usuario en la variable de clase para usarlos despues en el proceso de alquiler
        this.usuario = data;

        this.nombre = data.nombre || '';
        this.dni = data.dni || '';
        this.direccion = data.direccion || '';
        this.telefono = data.telefono || '';
        this.email = data.email || '';

        // Forzar la deteccion de cambios para actualizar la interfaz con los datos del usuario
        this.cdr.detectChanges();
      },

      // Manejo de errores en la consulta del usuario al backend
      error: (err) => {
        console.error('Error cargando usuario:', err);
        this.showMessage("No se pudieron cargar los datos del usuario");
      }
    });
  }

  //metodo para manejar proceso del pago y alquiler del trastero
  pagar() {
    //valido que abra el contrato para  que sea leido
    if (!this.contratoAbierto) {
      this.showMessage('Debes leer el contrato antes de pagar');
      return;
    }

    //valido que acepte normas en el checkbox para seguir con la contratacion
    if (!this.aceptaNormas) {
      this.showMessage('Debes aceptar las normas');
      return;
    }

    //valido que el usuario este logueado
    if (!this.usuario) {
      this.showMessage("Sesión no válida");
      this.router.navigate(['/login']);
      return;
    }

    //consulto al backend por un trastero libre del tamaño seleccionado
    this.trasteroService.getTrasteroLibre(this.tamanioSeleccionado).subscribe({
      next: (trastero) => {
        if (!trastero || !trastero.id_trastero) {
          this.showMessage("No hay trasteros libres de este tamaño");
          return;
        }

        // Si hay un trastero libre es asignado a usuario con los datos necesarios para el alquiler
        const duracionMeses = Number(this.duracionSeleccionada);
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio);
        // Sumar la duración en meses a la fecha de inicio para obtener la fecha de fin del alquiler
        fechaFin.setMonth(fechaInicio.getMonth() + duracionMeses);

        // paso los datos para asignar trastero al usuario al servicio de trastero con las fechas  y el token para autenticacion
        const data = {
          id_trastero: trastero.id_trastero,
          id_usuario: this.usuario.id_usuario,
          nombre: this.usuario.nombre,
          telefono: this.usuario.telefono,
          email: this.usuario.email,
          fecha_inicio: fechaInicio.toISOString().slice(0, 10),
          fecha_fin: fechaFin.toISOString().slice(0, 10),
          meses: duracionMeses,
          precio_mensual_aplicado: trastero.precio,
          estado: 'ocupado',
          token: localStorage.getItem('token') || ''
        };

        // Realizo la consulta al backend para asignar el trastero
        //  al usuario con los datos necesarios para el alquiler
        this.trasteroService.asignarTrastero(data).subscribe({
          next: (resp: any) => {
            if (resp.success) {
              this.showMessage('Trastero alquilado con éxito');
              this.nav.goTo('/');
            } else {
              this.showMessage(resp.message ?? "Error al asignar trastero");
            }
          },
          error: (err) => {
            console.error(err);
            this.showMessage('Error al asignar trastero');
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.showMessage('Error al consultar trasteros libres');
      }
    });
  }

  //metodo para cerrar el contrato y volver a la pagina principal
  cerrarCodigo() {
    this.codigoGeneradoVisible = false;
    this.nav.goTo('/');
  }

  //metodo para volver a la pagina principal
  goBack() {
    this.nav.goTo('/');
  }
}
