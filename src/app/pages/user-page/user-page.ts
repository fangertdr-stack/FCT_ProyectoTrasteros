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


  // inyecto los servicios necesarios para la pagina de usuario
  private trasteroService = inject(TrasteroService);
  private router = inject(Router);

  // sirven para guardar datos reactivos es decir valores que cuando cambian,
  //  actualizan automaticamente la interfaz que depende de ellos se utilizan para almacenar
  // los trasteros del usuario, el estado de carga y los errores  se utiliza signal porque
  //son datos que cambian a lo largo del tiempo y queremos que la interfaz se actualice automáticamente cuando cambien

  // creo una variable de tipo signal para almacenar los trasteros del usuario
  trastero = signal<Trastero[]>([]);
  usuarioId: number | null = null;


  // creo variables de tipo signal para controlar el estado de carga y errores
  cargando = signal(true);
  error = signal('');


  // metodo para cargar los trasteros del usuario al iniciar la pagina y cada vez que se navega a ella
  ngOnInit(): void {

    // valido que el codigo se ejecute solo en el navegador para evitar errores en el servidor al usar localStorage
    if (typeof window === 'undefined') return;


    // me suscribo a los eventos de navegación para cargar los datos cada vez que se navega a la pagina de usuario
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.init();
      });

    // cargo los datos al iniciar la pagina
    this.init();
  }

  // metodo para cargar los trasteros del usuario desde el servicio
  private init(): void {

    // valido que el codigo se ejecute solo en el navegador para evitar errores en el servidor
    const userRaw = localStorage.getItem('id_usuario');



    // valido que haya un usuario logueado si no hay muestro un error y dejo de cargar los datos
    if (!userRaw) {
      this.error.set('No hay usuario logueado');
      this.cargando.set(false);
      return;
    }

    this.usuarioId = Number(userRaw);

    // cargo los trasteros del usuario desde el servicio
    this.loadTrasteros();
  }


  // metodo para cargar los trasteros del usuario desde el servicio y filtrar
  //  solo los activos para mostrarlos en la interfaz
  private loadTrasteros(): void {

    if (!this.usuarioId) return;

    this.cargando.set(true);

    // llamo al servicio para obtener los trasteros del usuario y me suscribo a la respuesta
    this.trasteroService.getMisTrasteros(this.usuarioId)
      .subscribe({
        next: (data) => {

          console.log('RESPUESTA API:', data);

          const trasterosActivos = Array.isArray(data)
            ? data.filter(t => this.esTrasteroActivo(t))
            : [];

            // actualizo la variable de tipo signal con los trasteros activos para que la interfaz se actualice automaticamente
          this.trastero.set(trasterosActivos);

          // limpio el estado de error y cargo los datos
          this.cargando.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error cargando datos');
          this.cargando.set(false);
        }
      });
  }

  //metodo para comprobar si un trastero esta activo o no para mostrarlo solo los trasteros activos
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

  // metodo para calcular el precio total del alquiler de un trastero a partir de las fechas de inicio y fin y el precio mensual
  //  del trastero se utiliza para mostrar el precio total en la interfaz de usuario
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

  // metodo para navegar a la pagina principal
  goBack() {
    this.router.navigate(['']);
  }
}
