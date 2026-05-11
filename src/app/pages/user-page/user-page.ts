import { Component, OnInit, inject, signal } from '@angular/core';
import { TrasteroService } from '../../services/trasteroService';
import { Trastero } from '../../models/trastero';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.html',
  styleUrls: ['./user-page.css']
})
export class UserPage implements OnInit {

  private trasteroService = inject(TrasteroService);
  private router = inject(Router);


  trastero = signal<Trastero[]>([]);
  usuarioId: number | null = null;



  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {

    if (typeof window === 'undefined') return;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.init();
      });

    // primera carga
    this.init();
  }

  private init(): void {

    const userRaw = localStorage.getItem('id_usuario');



    if (!userRaw) {
      this.error.set('No hay usuario logueado');
      this.cargando.set(false);
      return;
    }

    this.usuarioId = Number(userRaw);



    this.loadTrasteros();
  }

  private loadTrasteros(): void {

    if (!this.usuarioId) return;



    this.cargando.set(true);

    this.trasteroService.getMisTrasteros(this.usuarioId)
      .subscribe({
        next: (data) => {

          console.log('RESPUESTA API:', data);

          const trasterosActivos = Array.isArray(data)
            ? data.filter(t => this.esTrasteroActivo(t))
            : [];

          this.trastero.set(trasterosActivos);

          this.cargando.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error cargando datos');
          this.cargando.set(false);
        }
      });
  }

  private esTrasteroActivo(t: Trastero): boolean {
    const estado = (t.estado ?? '').toLowerCase();
    const estadoTrastero = (t.estado_real ?? t.estado ?? '').toLowerCase();
    const estadoAlquiler = (t.estado_alquiler ?? '').toLowerCase();
    const tieneAlquilerPagado = estado === 'pagado' || estadoAlquiler === 'pagado';

    if (estadoTrastero === 'libre' || estado === 'finalizado' || estadoAlquiler === 'finalizado') {
      return false;
    }

    if (t.fecha_fin) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const fechaFin = new Date(t.fecha_fin);
      fechaFin.setHours(0, 0, 0, 0);

      if (fechaFin < hoy) {
        return false;
      }
    }

    return estadoTrastero === 'ocupado' || tieneAlquilerPagado;
  }

  calcularPrecioTotal(t: Trastero): number {

    // valido que las fechas existan para evitar error si no hay fechas devuelve 0 porque se declararon
    //en la interfaz que podia no existir fechas
    const fechaInicio = t.fechaInicio ?? t.fecha_inicio;

    if (!fechaInicio || !t.fecha_fin) {
      return 0
    }

    //convierto string a objeto date
    const inicio = new Date(fechaInicio);
    const fin = new Date(t.fecha_fin);

    //creo constante meses que es un calculo de años pero calculado en meses con el +1 incluyo el primer mes
    const meses =
      (fin.getFullYear() - inicio.getFullYear()) * 12 +
      (fin.getMonth() - inicio.getMonth());

    //devuelve numero de meses por el precio mensual del trastero
    return meses * t.precio;

  }

  goBack() {
    this.router.navigate(['']);
  }
}
