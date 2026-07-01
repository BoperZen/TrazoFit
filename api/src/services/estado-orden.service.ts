import { EstadoOrdenMap, getEnumOptions } from "../utils/enum-mappers";
import { EstadoOrden } from "../../generated/prisma";

export const estadoOrdenService = {
    async listar() {
        return getEnumOptions(EstadoOrdenMap);
    },

    async obtenerPorId(id: string) {
        // El "id" de un enum es su propia clave en mayúsculas "PENDIENTE"
        const key = id.toUpperCase() as EstadoOrden;
        const label = EstadoOrdenMap[key];

        if (!label) return null;

        return {
            value: key,
            label: label
        };
    }
};