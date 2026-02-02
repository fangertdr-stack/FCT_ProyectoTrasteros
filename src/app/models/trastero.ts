export interface Trastero {
    id_trastero: number;
    codigo: string;
    estado: 'OCUPADO' | 'LIBRE' | 'MANTENIMIENTO';
    precio: number;
    tamanio: 'PEQUEÑO' | 'MEDIANO' | 'GRANDE';

    usuario?: string; // temporal hasta backend real

}