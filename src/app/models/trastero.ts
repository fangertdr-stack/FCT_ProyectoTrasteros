//interfaz trastero
export interface Trastero {
  id_trastero: number;
  codigo: string;
  tamanio: 'pequeño' | 'mediano' | 'grande';
  precio: number;
  estado: 'libre' | 'ocupado' | 'mantenimiento';
 estado_real?: string;
  estado_alquiler?: string;
  id_usuario?: number;
  usuario?: string;
  fecha_inicio?: string;
  fechaInicio?: string;
  fecha_fin?: string;
  importe_total?: number | string;
  mesesContrato?: number;
}
