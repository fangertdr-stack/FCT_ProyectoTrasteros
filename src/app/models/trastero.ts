export interface Trastero {
    id_trastero: number;
    codigo: string;
    estado: 'OCUPADO' | 'LIBRE';
    precio: number;
    tamanio: 'P' | 'M' | 'G';

    usuario?: string; // temporal hasta backend real

}