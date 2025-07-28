import { computed } from 'vue';
import { useLocalStorage } from './useLocalStorage';
import { initialAppointments, patients as initialPatients, doctors as initialDoctors } from '../data/mockData';
import { DateTime } from 'luxon';

export function useAppointments() {
    const appointments = useLocalStorage('appointments', initialAppointments);
    const patients = useLocalStorage('patients', initialPatients);
    const doctors = useLocalStorage('doctors', initialDoctors);

    const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const createPatient = (patientData) => {
        const newPatient = {
            ...patientData,
            id: parseInt(generateId()),
            createdAt: new Date().toISOString()
        };
        
        patients.value.push(newPatient);
        console.log('[SISTEMA] Nuevo paciente creado:', newPatient);
        
        return newPatient;
    };

    const createDoctor = (doctorData) => {
        const newDoctor = {
            ...doctorData,
            id: parseInt(generateId()),
            createdAt: new Date().toISOString()
        };
        
        doctors.value.push(newDoctor);
        console.log('[SISTEMA] Nuevo doctor creado:', newDoctor);
        
        return newDoctor;
    };

    const createAppointment = (appointmentData) => {
        const newAppointment = {
            ...appointmentData,
            id: `apt_${generateId()}`,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            calendars: {
                doctor: { synced: true, syncedAt: new Date().toISOString() },
                patient: { synced: true, syncedAt: new Date().toISOString() }
            }
        };

        appointments.value.push(newAppointment);
        
        simulateEmailNotification(newAppointment, 'created');
        
        return newAppointment;
    };

    const cancelAppointment = (appointmentId) => {
        const index = appointments.value.findIndex(apt => apt.id === appointmentId);
        if (index !== -1) {
            const appointment = appointments.value[index];
            appointments.value.splice(index, 1);
            
            simulateEmailNotification(appointment, 'cancelled');
        }
    };
    
    const confirmAppointment = (appointmentId) => {
    const index = appointments.value.findIndex(apt => apt.id === appointmentId);
    if (index !== -1) {
        const appointment = appointments.value[index];
        appointments.value[index] = {
            ...appointment,
            status: 'confirmed'
        };
        
        simulateEmailNotification(appointment, 'confirmed');
    }
};
    const checkOverlap = (date, time, duration, doctorId, excludeId = null) => {
        return appointments.value.some(apt => {
            if (apt.id === excludeId || apt.doctorId !== doctorId) return false;
            
            const newStart = DateTime.fromISO(`${date}T${time}`);
            const newEnd = newStart.plus({ minutes: duration });
            
            const existingStart = DateTime.fromISO(`${apt.date}T${apt.time}`);
            const existingEnd = existingStart.plus({ minutes: apt.duration });
            
            return newStart < existingEnd && existingStart < newEnd;
        });
    };

    const simulateEmailNotification = (appointment, action) => {
        const patient = patients.value.find(p => p.id === appointment.patientId);
        const doctor = doctors.value.find(d => d.id === appointment.doctorId);
        
        console.log(`[MAILTRAP SIMULADO] Email enviado:`, {
            action,
            to: [patient?.email, doctor?.email],
            subject: action === 'created' ? 'Cita Confirmada' : 'Cita Cancelada',
            appointment
        });
    };

    const appointmentsWithDetails = computed(() => {
        return appointments.value.map(apt => ({
            ...apt,
            patient: patients.value.find(p => p.id === apt.patientId),
            doctor: doctors.value.find(d => d.id === apt.doctorId)
        }));
    });

    const exportToICal = () => {
        const icalContent = generateICalContent(appointments.value);
        downloadFile(icalContent, 'citas.ics', 'text/calendar');
    };

    return {
        appointments: appointmentsWithDetails,
        patients,
        doctors,
        createAppointment,
        createPatient,
        createDoctor,
        cancelAppointment,
        checkOverlap,
        exportToICal,
        confirmAppointment
    };
}

function generateICalContent(appointments) {
    let content = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Sistema Citas//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ];

    appointments.forEach(apt => {
        const start = DateTime.fromISO(`${apt.date}T${apt.time}`)
            .toFormat("yyyyMMdd'T'HHmmss");
        const end = DateTime.fromISO(`${apt.date}T${apt.time}`)
            .plus({ minutes: apt.duration })
            .toFormat("yyyyMMdd'T'HHmmss");

        content.push(
            'BEGIN:VEVENT',
            `UID:${apt.id}@sistema-citas.com`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:Cita Médica - ${apt.reason}`,
            `DESCRIPTION:Detalles de la cita médica`,
            'STATUS:CONFIRMED',
            'END:VEVENT'
        );
    });

    content.push('END:VCALENDAR');
    return content.join('\r\n');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}