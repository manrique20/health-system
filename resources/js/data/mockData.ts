export interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    timezone: string;
    userType?: string;
}

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    timezone: string;
    email: string;
    userType?: string;
}

export type AppointmentStatus = 'confirmed' | 'scheduled' | 'cancelled' | 'completed';

export interface Appointment {
    id: string;
    patientId: number;
    doctorId: number;
    date: string;
    time: string;
    duration: number;
    status: AppointmentStatus;
    reason: string;
    patientTimezone: string;
    doctorTimezone: string;
}

export const patients: Patient[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', phone: '+34 612 345 678', timezone: 'Europe/Madrid', userType: 'patient' },
    {
        id: 2,
        name: 'María García',
        email: 'paciente@email.com',
        phone: '+54 11 4567 8901',
        timezone: 'America/Argentina/Buenos_Aires',
        userType: 'patient',
    },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', phone: '+34 623 456 789', timezone: 'Europe/Madrid', userType: 'patient' },
    {
        id: 4,
        name: 'Ana Martínez',
        email: 'ana@email.com',
        phone: '+54 11 5678 9012',
        timezone: 'America/Argentina/Buenos_Aires',
        userType: 'patient',
    },
];

export const doctors: Doctor[] = [
    { id: 1, name: 'Dr. Roberto Sánchez', specialty: 'Medicina General', timezone: 'Europe/Madrid', email: 'doctor@email.com', userType: 'doctor' },
    {
        id: 2,
        name: 'Dra. Laura Fernández',
        specialty: 'Pediatría',
        timezone: 'America/Argentina/Buenos_Aires',
        email: 'laura@email.com',
        userType: 'doctor',
    },
];

export const initialAppointments: Appointment[] = [
    {
        id: 'apt_1',
        patientId: 1,
        doctorId: 1,
        date: '2025-07-27',
        time: '10:00',
        duration: 30,
        status: 'confirmed',
        reason: 'Consulta general',
        patientTimezone: 'Europe/Madrid',
        doctorTimezone: 'Europe/Madrid',
    },
    {
        id: 'apt_2',
        patientId: 2,
        doctorId: 2,
        date: '2025-07-25',
        time: '14:30',
        duration: 45,
        status: 'scheduled',
        reason: 'Control pediátrico',
        patientTimezone: 'America/Argentina/Buenos_Aires',
        doctorTimezone: 'America/Argentina/Buenos_Aires',
    },
];

export const validateEmail = (
    email: string,
    patientsList: Array<Patient>,
    doctorsList: Array<Doctor>,
): { isValid: boolean; userType?: 'patient' | 'doctor'; userData?: Patient | Doctor } => {
    if (!email) {
        return { isValid: false };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false };
    }

    const patient = patientsList.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (patient) {
        return { isValid: true, userType: 'patient', userData: patient };
    }

    const doctor = doctorsList.find((d) => d.email?.toLowerCase() === email.toLowerCase());
    if (doctor) {
        return { isValid: true, userType: 'doctor', userData: doctor };
    }

    return { isValid: false };
};
