export interface Trastero {
  id_trastero: number;
  codigo: string;
  tamanio: 'pequeño' | 'mediano' | 'grande';
  precio: number;
  estado: 'libre' | 'ocupado' | 'mantenimiento';
  usuario?: string;
  fechaInicio?: string;
  mesesContrato?: number;
}
