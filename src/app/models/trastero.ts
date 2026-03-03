export interface Trastero {
  id_trastero: number;
  codigo: number; // ⚠️ es INT en tu BD
  tamanio: 'pequeño' | 'mediano' | 'grande';
  precio: number;
  estado: 'libre' | 'ocupado' | 'mantenimiento';
  usuario?: string;
  fechaInicio?: string;
  mesesContrato?: number;
}
