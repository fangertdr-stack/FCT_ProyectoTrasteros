export interface Trastero {
  id_trastero: number;
  codigo: string;
  tamanio: 'pequeño' | 'mediano' | 'grande';
  precio: number;
  estado: 'libre' | 'ocupado' | 'mantenimiento';

  // NUEVAS PROPIEDADES para contrato
  id_usuario?: number;
  usuario?: string;
  fechaInicio?: string;
  fecha_fin?: string;   
  mesesContrato?: number;
}