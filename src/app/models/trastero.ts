export interface Trastero {
    id_trastero: number;
    codigo: string;
    estado: 'OCUPADO' | 'LIBRE' | 'MANTENIMIENTO';
    precio: number;
    tamanio: 'PEQUEÑO' | 'MEDIANO' | 'GRANDE';

    // temporal hasta backend real
    usuario?: string; 
    fechaInicio?: string;
    mesesContrato?: number;

}