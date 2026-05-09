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

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  get isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }

  ngOnInit() {
    if (!this.isLoggedIn) {
      this.showMessage("Debes iniciar sesión para alquilar un trastero");
      this.router.navigate(['/login']);
      return;
    }

    this.route.queryParams.subscribe(params => {
      if (params['tamanio']) {
        this.tamanioSeleccionado = params['tamanio'];
      }
    });

    this.nombre = this.login.getNombrePublico();
    this.cdr.detectChanges();

    const token = localStorage.getItem('token');
    const user = this.login.getUserFromToken();
    const idUsuario = user?.id_usuario;

    console.log('TOKEN RAW:', token);
    console.log('DECODE:', user);
    console.log('ID desde JWT:', idUsuario);

    if (!idUsuario) {
      this.showMessage("Sesión no válida");
      this.router.navigate(['/login']);
      return;
    }

    this.trasteroService.getUsuario(idUsuario).subscribe({
      next: (res) => {
        console.log('Respuesta backend usuario:', res);

        if (!res || res.success === false) {
          console.warn('Usuario no encontrado:', res);
          this.showMessage("No se pudieron cargar los datos del usuario");
          return;
        }

        const data = res.data ?? res;

        if (!data || !data.id_usuario) {
          console.warn('Respuesta de usuario inválida:', data);
          this.showMessage("No se pudieron cargar los datos del usuario");
          return;
        }

        this.usuario = data;

        this.nombre = data.nombre || '';
        this.dni = data.dni || '';
        this.direccion = data.direccion || '';
        this.telefono = data.telefono || '';
        this.email = data.email || '';

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error cargando usuario:', err);
        this.showMessage("No se pudieron cargar los datos del usuario");
      }
    });
  }

  pagar() {
    if (!this.contratoAbierto) {
      this.showMessage('Debes leer el contrato antes de pagar');
      return;
    }

    if (!this.aceptaNormas) {
      this.showMessage('Debes aceptar las normas');
      return;
    }

    if (!this.usuario) {
      this.showMessage("Sesión no válida");
      this.router.navigate(['/login']);
      return;
    }

    this.trasteroService.getTrasteroLibre(this.tamanioSeleccionado).subscribe({
      next: (trastero) => {
        if (!trastero || !trastero.id_trastero) {
          this.showMessage("No hay trasteros libres de este tamaño");
          return;
        }

        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaInicio.getMonth() + this.duracionSeleccionada);

        const data = {
          id_trastero: trastero.id_trastero,
          id_usuario: this.usuario.id_usuario,
          nombre: this.usuario.nombre,
          telefono: this.usuario.telefono,
          email: this.usuario.email,
          fecha_inicio: fechaInicio.toISOString().slice(0, 10),
          fecha_fin: fechaFin.toISOString().slice(0, 10),
          precio_mensual_aplicado: trastero.precio,
          estado: 'ocupado',
          token: localStorage.getItem('token') || ''
        };

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

  cerrarCodigo() {
    this.codigoGeneradoVisible = false;
    this.nav.goTo('/');
  }

  goBack() {
    this.nav.goTo('/');
  }
}
