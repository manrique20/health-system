import { DateTime } from 'luxon';
import { ref } from 'vue';

export function useTimezone() {
    const userTimezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Convertir fecha/hora a diferentes zonas horarias
    const convertTime = (date, time, fromZone, toZone) => {
        return DateTime.fromISO(`${date}T${time}`, { zone: fromZone }).setZone(toZone);
    };

    // Formatear para mostrar al usuario
    const formatDateTime = (date, time, timezone) => {
        const dt = DateTime.fromISO(`${date}T${time}`, { zone: timezone });
        return {
            date: dt.toFormat('dd/MM/yyyy'),
            time: dt.toFormat('HH:mm'),
            timezone: dt.zoneName,
            offset: dt.toFormat('ZZ'),
        };
    };

    // Obtener hora actual en zona específica
    const getNowInTimezone = (timezone) => {
        return DateTime.now().setZone(timezone);
    };

    return {
        userTimezone,
        convertTime,
        formatDateTime,
        getNowInTimezone,
    };
}
