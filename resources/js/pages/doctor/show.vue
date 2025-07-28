
<script setup lang="ts">
import AppointmentForm from '@/components/AppointmentForm.vue';
import AppointmentList from '@/components/AppointmentList.vue';
import CalendarView from '@/components/CalendarView.vue';
import CreatePatient from '@/components/CreatePatient.vue';
import { useAppointments } from '@/composables/useAppointments';
import { useTimezone } from '@/composables/useTimezone';
import { DateTime } from 'luxon';
import 'primeicons/primeicons.css';
import { computed, ref } from 'vue';
import { usePage } from '@inertiajs/vue3'

const page = usePage()

const { appointments, patients, doctors, createAppointment, createPatient, cancelAppointment, exportToICal } = useAppointments();
const { userTimezone } = useTimezone();

const showForm = ref(false);
const showCalendar = ref(false);
const selectedDate = ref();
const showPatientForm = ref(false);

const doctorId = computed(() => {
    return Number(page.props.id);
});

const currentDoctor = computed(() => {
    return doctors.value.find(doctor => doctor.id === doctorId.value);
});

const doctorAppointments = computed(() => {
    return appointments.value.filter(apt => apt.doctorId === doctorId.value);
});

const todayDoctorAppointments = computed(() => {
    const today = DateTime.now().toISODate();
    return doctorAppointments.value.filter((apt) => apt.date === today);
});

const confirmedAppointments = computed(() => {
    return doctorAppointments.value.filter(apt => apt.status === 'confirmed');
});

const scheduledAppointments = computed(() => {
    return doctorAppointments.value.filter(apt => apt.status === 'scheduled');
});

const completedAppointments = computed(() => {
    return doctorAppointments.value.filter(apt => apt.status === 'completed');
});

const filteredDoctorAppointments = computed(() => {
    if (!selectedDate.value) return doctorAppointments.value;
    return doctorAppointments.value.filter((apt) => apt.date === selectedDate.value);
});

const handleSave = async (appointmentData) => {
    try {
        const appointmentWithDoctor = {
            ...appointmentData,
            doctorId: doctorId.value
        };
        
        await createAppointment(appointmentWithDoctor);
        showForm.value = false;
        alert('Cita creada exitosamente. Se han enviado los correos de confirmación.');
    } catch (error) {
        alert('Error al crear la cita: ' + error.message);
    }
};

const handleCancel = async (appointmentId) => {
    if (confirm('¿Está seguro de cancelar esta cita?')) {
        await cancelAppointment(appointmentId);
        alert('Cita cancelada. Se han enviado los correos de notificación.');
    }
};

const handleCreatePatient = async (patientData) => {
    try {
        await createPatient(patientData);
        console.log('Paciente creado exitosamente');
        showPatientForm.value = false;
        alert('Paciente creado exitosamente.');
    } catch (error) {
        console.error('Error al crear paciente:', error);
        alert('Error al crear paciente: ' + error.message);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <div class="container mx-auto px-4 py-8">
            <div class="mb-6 rounded-lg bg-white p-6 shadow-md">
                <h1 class="mb-2 text-3xl font-bold text-gray-800">
                    Panel de Control de Citas - {{ currentDoctor?.name || 'Médico' }}
                </h1>
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <p class="text-gray-600">Zona horaria: {{ userTimezone }} ({{
                        DateTime.now().setZone(userTimezone).toFormat('ZZ') }})</p>
                    <div class="flex flex-wrap gap-2">
                        <button @click="showPatientForm = true"
                            class="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
                            + Paciente
                        </button>
                        <button @click="exportToICal"
                            class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                            <i class="pi pi-file-export" style="color: white"></i>
                            Exportar iCal
                        </button>
                        <button @click="showCalendar = !showCalendar"
                            class="flex items-center gap-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            <i :class="`pi pi-${showCalendar ? 'list' : 'calendar-plus'} `"></i>
                            {{ showCalendar ? 'Vista Lista' : 'Vista Calendario' }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <div class="lg:col-span-1">
                    <div class="rounded-lg bg-white p-6 shadow-md">
                        <div class="mb-6 border-b pb-4">
                            <h3 class="mb-2 font-semibold text-gray-700">Información del Médico</h3>
                            <div v-if="currentDoctor" class="space-y-1 text-sm">
                                <p class="text-black"><strong>Nombre:</strong> {{ currentDoctor.name }}</p>
                                <p class="text-black"><strong>Especialidad:</strong> {{ currentDoctor.specialty }}</p>
                                <p class="text-black"><strong>Email:</strong> {{ currentDoctor.email }}</p>
                                <p class="text-black"><strong>Zona horaria:</strong> {{ currentDoctor.timezone }}</p>
                            </div>
                            <div v-else class="text-red-500">
                                <p>Médico no encontrado (ID: {{ doctorId }})</p>
                            </div>
                        </div>

                        <button @click="showForm = true"
                            class="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600">
                            + Nueva Cita
                        </button>

                        <div class="mt-6">
                            <h3 class="mb-3 font-semibold text-gray-700">Filtrar por fecha</h3>
                            <input type="date" v-model="selectedDate"
                                class="w-full rounded-lg border px-3 py-2 text-black" />
                        </div>

                        <div class="mt-6">
                            <h3 class="mb-3 font-semibold text-gray-700">Estadísticas</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between text-black">
                                    <span>Total citas:</span>
                                    <span class="font-semibold">{{ doctorAppointments.length }}</span>
                                </div>
                                <div class="flex justify-between text-black">
                                    <span>Hoy:</span>
                                    <span class="font-semibold">{{ todayDoctorAppointments.length }}</span>
                                </div>
                                <div class="flex justify-between text-black">
                                    <span>Confirmadas:</span>
                                    <span class="font-semibold">{{ confirmedAppointments.length }}</span>
                                </div>
                                <div class="flex justify-between text-black">
                                    <span>Programadas:</span>
                                    <span class="font-semibold">{{ scheduledAppointments.length }}</span>
                                </div>
                                <div class="flex justify-between text-black">
                                    <span>Completadas:</span>
                                    <span class="font-semibold">{{ completedAppointments.length }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Horarios de trabajo (ejemplo) -->
                        <div class="mt-6">
                            <h3 class="mb-3 font-semibold text-gray-700">Horarios de Atención</h3>
                            <div class="space-y-1 text-sm text-black">
                                <p>Lunes - Viernes: 9:00 - 17:00</p>
                                <p>Sábados: 9:00 - 13:00</p>
                                <p class="text-gray-500">Domingos: Cerrado</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-3">
                    <CalendarView v-if="showCalendar" :appointments="doctorAppointments"
                        @select-date="selectedDate = $event" />
                    <AppointmentList v-else :appointments="filteredDoctorAppointments" @cancel="handleCancel" />
                </div>
            </div>

            <AppointmentForm v-if="showForm" :patients="patients" :doctors="[currentDoctor]" @save="handleSave"
                @close="showForm = false" :preselected-doctor="currentDoctor" />

            <CreatePatient v-if="showPatientForm" @save="handleCreatePatient" @close="showPatientForm = false" />
        </div>
    </div>
</template>
