import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Trastero } from '../../models/trastero';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation';
import { TrasteroService } from '../../services/trasteroService';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.css'],
})
export class AdminPage implements OnInit {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private nav: NavigationService,
    private trasteroService: TrasteroService,
    private snackBar: MatSnackBar
  ) { }

  showMessage(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error']
    });
  }

  //declaracion de array tipo Trasetro, usuario y meses disponibles para contrato
  trasteros: Trastero[] = [];
  usuarios: any[] = [];
  mesesDisponibles = [1, 2, 3, 4, 5, 6, 9, 12];


  //guarda trastero seleccionado o null
  trasteroSeleccionado: Trastero | null = null;

  mostrarModal = false;

  //guarda trastero a liberar o null
  trasteroALiberar: Trastero | null = null;

  // Observable para trasteros
  private trasterosSubject = new BehaviorSubject<Trastero[]>([]);
  trastero$: Observable<Trastero[]> = this.trasterosSubject.asObservable();



  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    //se comprueba si hay token es decir si ha iniciado sesion
    if (!localStorage.getItem('token')) {
      this.nav.goTo('login');
      return;
    }


    // Cargar trasteros
    this.cargarTrasteros();

    // Cargar usuarios
    this.trasteroService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });
  }

  trackByTrasteroId(index: number, item: Trastero) {
    return item.id_trastero;
  }

  cargarTrasteros() {
    this.trasteroService.getTrasteros().subscribe({
      next: (data) => {

        this.trasteros = data;
        this.trasterosSubject.next(data);
      },
      error: (err) => {
        console.error('Error al cargar trasteros', err);
      }
    });
  }


  //esta funcion actualiza el trastero en la tabla despues de una modificacion sin necesidad de recargar toda la lista,
  //  se le pasa el trastero actualizado y se mapea la lista de trasteros para actualizar solo el modificado
  private actualizarTrasteroEnTabla(trasteroActualizado: Trastero) {
    const trasteros = this.trasterosSubject.value.map(t =>
      t.id_trastero === trasteroActualizado.id_trastero
        ? { ...t, ...trasteroActualizado }
        : t
    );

    // Actualizar el array local y el BehaviorSubject
    this.trasteros = trasteros;

    // Emitir la nueva lista de trasteros actualizada
    this.trasterosSubject.next(trasteros);
  }


  // Esta función prepara un objeto Trastero actualizado para reflejar
  //  los cambios localmente en la tabla después de una modificación.
  //esta función construye un trastero actualizado mezclando los datos antiguos con los nuevos,
  //  para que la tabla del admin cambie inmediatamente después de guardar.
  private prepararActualizacionLocal(data: any): Trastero {
    const usuario = this.usuarios.find(u => u.id_usuario === data.id_usuario);

    return {
      ...this.trasteroSeleccionado!,
      estado: data.estado,
      estado_real: data.estado,
      id_usuario: data.id_usuario ?? this.trasteroSeleccionado?.id_usuario,
      usuario: usuario?.nombre ?? this.trasteroSeleccionado?.usuario,
      fecha_inicio: data.fecha_inicio ?? this.trasteroSeleccionado?.fecha_inicio,
      fechaInicio: data.fecha_inicio ?? this.trasteroSeleccionado?.fechaInicio,
      fecha_fin: data.fecha_fin ?? this.trasteroSeleccionado?.fecha_fin,
    };
  }

  irAlMain() {
    console.log("Navegando al main");
    this.nav.goTo('');
  }

  gestionUsuarios() {
    console.log("Navegando a gestión de usuarios");
    this.nav.goTo('users');
  }


  // Esta función se llama al seleccionar un trastero de la tabla para editarlo.
  seleccionar(t: Trastero) {
    //console.log("Trastero seleccionado:", t);
    this.trasteroSeleccionado = {
      ...t,
      id_usuario: t.id_usuario ?? undefined,
      fechaInicio: t.fechaInicio ?? t.fecha_inicio ?? '', // el backend devuelve fecha_inicio
      mesesContrato: t.mesesContrato ?? undefined // inicializar null
    };
    //console.log("Copia para edición:", this.trasteroSeleccionado);
  }

  cambiarEstado(estado: 'libre' | 'ocupado' | 'mantenimiento') {
    if (!this.trasteroSeleccionado) return;

    if (estado === 'mantenimiento' && this.trasteroOcupadoSeleccionado) {
      this.showMessage('No se puede poner en mantenimiento un trastero ocupado. Primero libera el trastero.');

      return;
    }

    this.trasteroSeleccionado.estado = estado;

    if (estado !== 'ocupado') {
      this.trasteroSeleccionado.usuario = undefined;
      this.trasteroSeleccionado.id_usuario = undefined;
      this.trasteroSeleccionado.fechaInicio = '';
      this.trasteroSeleccionado.mesesContrato = undefined;
    }

    if (this.trasteroSeleccionado.estado === 'mantenimiento' && estado !== 'mantenimiento') {

      this.showMessage('Trastero puesto en mantenimiento. No se podrá alquilar hasta que se vuelva a poner como libre.');

      return;
    }



  }
  calcularFechaFin(fechaInicio?: string, meses?: number | string): string | null {
    console.log("Calculando fecha fin seguro...");
    if (!fechaInicio || !meses) return null;

    const mesesNum = Number(meses);
    console.log("Meses convertidos a número:", mesesNum);

    const [year, month, day] = fechaInicio.split('-').map(Number);
    const inicio = new Date(year, month - 1, day);
    console.log("Fecha inicio segura (Date):", inicio);

    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + mesesNum);
    console.log("Fecha fin segura (Date):", fin);

    const y = fin.getFullYear();
    const m = String(fin.getMonth() + 1).padStart(2, '0');
    const d = String(fin.getDate()).padStart(2, '0');

    const resultado = `${y}-${m}-${d}`;
    console.log("Fecha fin segura enviada al backend:", resultado);

    return resultado;
  }


  // no se esta usando
  estadoContrato(fechaFin: string | null): 'verde' | 'amarillo' | 'rojo' | null {
    console.log("Evaluando estado contrato para fecha:", fechaFin);

    if (!fechaFin) return null;

    const hoy = new Date();
    const fin = new Date(fechaFin);

    const diffMs = fin.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    console.log("Días restantes de contrato:", diffDias);

    if (diffDias > 15) return 'verde';
    if (diffDias > 5) return 'amarillo';

    return 'rojo';
  }

  private formatearFechaLocal(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private crearFechaLocal(fecha: string): Date {
    const [year, month, day] = fecha.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private sumarMeses(fecha: Date, meses: number): Date {
    const resultado = new Date(fecha);
    resultado.setMonth(resultado.getMonth() + meses);

    return resultado;
  }

  get esContratoExistente(): boolean {
    return this.trasteroSeleccionado?.estado === 'ocupado' && !!this.trasteroSeleccionado.fecha_fin;
  }

  get trasteroOcupadoSeleccionado(): boolean {
    const estado = this.trasteroSeleccionado?.estado;
    const estadoReal = this.trasteroSeleccionado?.estado_real;

    return estado === 'ocupado' || estadoReal === 'ocupado' || !!this.trasteroSeleccionado?.fecha_fin;
  }

  get fechaInicioAutomatica(): string {
    return this.formatearFechaLocal(new Date());
  }

  get fechaBaseContrato(): string {
    return this.trasteroSeleccionado?.fecha_fin ?? this.fechaInicioAutomatica;
  }

  get fechaInicioContrato(): string {
    return this.trasteroSeleccionado?.fechaInicio
      ?? this.trasteroSeleccionado?.fecha_inicio
      ?? this.fechaInicioAutomatica;
  }

  get fechaFinAutomatica(): string | null {
    const meses = Number(this.trasteroSeleccionado?.mesesContrato);

    if (!meses) return null;

    const fechaBase = this.esContratoExistente
      ? this.crearFechaLocal(this.fechaBaseContrato)
      : new Date();

    return this.formatearFechaLocal(this.sumarMeses(fechaBase, meses));
  }

  guardar() {
    if (!this.trasteroSeleccionado) return;

    if (this.trasteroSeleccionado.estado === 'ocupado') {
      if (!this.esContratoExistente && !this.trasteroSeleccionado.id_usuario) {
        this.showMessage("Selecciona un usuario.");
        return;
      }
      if (!this.trasteroSeleccionado.mesesContrato) {
        this.showMessage("Selecciona los meses del contrato");
        return;
      }
      if (this.esContratoExistente && !this.fechaInicioContrato) {
        this.showMessage("No se pudo leer la fecha de inicio del alquiler actual");
        return;
      }
    }

    // Construir objeto a enviar
    const data: any = {
      id_trastero: this.trasteroSeleccionado.id_trastero,
      estado: this.trasteroSeleccionado.estado,
      precio_mensual_aplicado: this.trasteroSeleccionado.precio,
      token: localStorage.getItem('token') || ''
    };

    if (this.trasteroSeleccionado.estado === 'ocupado') {
      const mesesContrato = Number(this.trasteroSeleccionado.mesesContrato);

      if (this.trasteroSeleccionado.id_usuario) {
        data.id_usuario = this.trasteroSeleccionado.id_usuario;
      }

      data.fecha_inicio = this.esContratoExistente ? this.fechaInicioContrato : this.fechaInicioAutomatica;
      data.fecha_fin = this.fechaFinAutomatica;
      data.meses = mesesContrato;
    }

    const guardar$ = this.esContratoExistente
      ? this.trasteroService.prorrogarAlquiler(data)
      : this.trasteroService.asignarTrastero(data);

    guardar$.subscribe({
      next: () => {
        this.actualizarTrasteroEnTabla(this.prepararActualizacionLocal(data));
        this.trasteroSeleccionado = null;
        this.cargarTrasteros();
      },
      error: (err) => {
        this.showMessage("Error guardando contrato");
        console.error("Error guardando contrato", err);
      }
    });
  }

  liberar(t: Trastero) {
    console.log("Preparando liberar trastero:", t);
    this.trasteroALiberar = t;
    this.mostrarModal = true;
  }

  confirmarLiberar() {
    if (!this.trasteroALiberar) return;

    console.log("Liberando trastero:", this.trasteroALiberar);

    // guardar id antes
    const idTrastero = this.trasteroALiberar.id_trastero;

    this.cerrarModal(); // cerrar modal inmediatamente

    this.trasteroService.liberarTrastero(idTrastero).subscribe({
      next: () => {
        this.cargarTrasteros(); // recargar trasteros
      },
      error: (err) => {
        console.error("Error liberando trastero", err);
      }
    });
  }

  cerrarModal() {
    console.log("Cerrando modal");
    this.mostrarModal = false;
    this.trasteroALiberar = null;
  }

}
