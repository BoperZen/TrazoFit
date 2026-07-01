export type EstadoOrden = 'PENDIENTE' | 'PAGADA' | 'ENVIADA' | 'CANCELADA';

export interface EstadoOrdenOption {
    value: EstadoOrden;
    label: string;
}