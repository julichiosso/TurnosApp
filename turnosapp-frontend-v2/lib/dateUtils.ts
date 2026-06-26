/**
 * Utilidades de fecha — siempre en hora local, nunca en UTC.
 * Evita el bug clásico de new Date("YYYY-MM-DD") que interpreta medianoche UTC.
 */

/** Devuelve la fecha de hoy como "YYYY-MM-DD" en hora local. */
export function hoyComo(): string {
    const d = new Date();
    return toISOLocal(d);
}

/**
 * Convierte un objeto Date a string "YYYY-MM-DD" usando la hora LOCAL del dispositivo.
 * Equivalente seguro a d.toISOString().split("T")[0] pero sin conversión UTC.
 */
export function toISOLocal(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Formatea un string "YYYY-MM-DD" como texto legible en español (es-AR),
 * p.ej. "viernes, 27 de junio". Usa T12:00:00 internamente para evitar offset UTC.
 */
export function formatFechaLarga(iso: string): string {
    return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
}

/**
 * Formatea un string "YYYY-MM-DD" como texto corto en español (es-AR),
 * p.ej. "27 jun".
 */
export function formatFechaCorta(iso: string): string {
    return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
    });
}

/**
 * Formatea un string "YYYY-MM-DD" con año completo en español (es-AR),
 * p.ej. "27 de junio de 2026".
 */
export function formatFechaCompleta(iso: string): string {
    return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
