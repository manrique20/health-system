
<script setup lang="ts">
import AppointmentForm from '@/components/AppointmentForm.vue';
import AppointmentList from '@/components/AppointmentList.vue';
import CalendarView from '@/components/CalendarView.vue';
import { useAppointments } from '@/composables/useAppointments';
import { useTimezone } from '@/composables/useTimezone';
import { DateTime } from 'luxon';
import 'primeicons/primeicons.css';
import { computed, ref } from 'vue';
import { usePage } from '@inertiajs/vue3'

const page = usePage()

const { appointments, patients, doctors, createAppointment, cancelAppointment, exportToICal } = useAppointments();
const { userTimezone } = useTimezone();

const showForm = ref(false);
const showCalendar = ref(false);
const selectedDate = ref();

const patientId = computed(() => {
    return Number(page.props.id);
});

const currentPatient = computed(() => {
    return patients.value.find(patient => patient.id === patientId.value);
});

const patientAppointments = computed(() => {
    return appointments.value.filter(apt => apt.patientId === patientId.value);
});

const todayPatientAppointments = computed(() => {
    const today = DateTime.now().toISODate();
    return patientAppointments.value.filter((apt) => apt.date === today);
});

const confirmedAppointments = computed(() => {
    return patientAppointments.value.filter(apt => apt.status === 'confirmed');
});

const scheduledAppointments = computed(() => {
    return patientAppointments.value.filter(apt => apt.status === 'scheduled');
});

const filteredPatientAppointments = computed(() => {
    if (!selectedDate.value) return patientAppointments.value;
    return patientAppointments.value.filter((apt) => apt.date === selectedDate.value);
});

const handleSave = async (appointmentData) => {
    try {
        const appointmentWithPatient = {
            ...appointmentData,
            patientId: patientId.value
        };
        
        await createAppointment(appointmentWithPatient);
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
</script>
<template>
    <div class="min-h-screen bg-gray-100">
        <div class="container mx-auto px-4 py-8">
            <div class="mb-6 rounded-lg bg-white p-6 shadow-md">
                <h1 class="mb-2 text-3xl font-bold text-gray-800">
                    Panel de Control de Citas - {{ currentPatient?.name || 'Paciente' }}
                </h1>
                <div class="flex items-center justify-between">
                    <p class="text-gray-600">Zona horaria: {{ userTimezone }} ({{
                        DateTime.now().setZone(userTimezone).toFormat('ZZ') }})</p>
                    <div class="flex space-x-2">
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
                        <!-- Información del paciente -->
                        <div class="mb-6 border-b pb-4">
                            <h3 class="mb-2 font-semibold text-gray-700">Información del Paciente</h3>
                            <div v-if="currentPatient" class="space-y-1 text-sm">
                                <p class="text-black"><strong>Nombre:</strong> {{ currentPatient.name }}</p>
                                <p class="text-black"><strong>Email:</strong> {{ currentPatient.email }}</p>
                                <p class="text-black"><strong>Teléfono:</strong> {{ currentPatient.phone }}</p>
                                <p class="text-black"><strong>Zona horaria:</strong> {{ currentPatient.timezone }}</p>
                            </div>
                            <div v-else class="text-red-500">
                                <p>Paciente no encontrado (ID: {{ patientId }})</p>
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
                                    <span class="font-semibold">{{ patientAppointments.length }}</span>
                                </div>
                                <div class="flex justify-between text-black">
                                    <span>Hoy:</span>
                                    <span class="font-semibold">{{ todayPatientAppointments.length }}</span>
                                </div>
                                <div class="flex justify-between text-black">
                                    <span>Confirmadas:</span>
                                    <span class="font-semibold">{{ confirmedAppointments.length }}</span>
                                </div>
                                <div class="flex justify-between text-black">
                                    <span>Programadas:</span>
                                    <span class="font-semibold">{{ scheduledAppointments.length }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-3">
                    <CalendarView v-if="showCalendar" :appointments="patientAppointments"
                        @select-date="selectedDate = $event" />
                    <AppointmentList v-else :appointments="filteredPatientAppointments" @cancel="handleCancel" />
                </div>
            </div>
            <AppointmentForm v-if="showForm" :patients="[currentPatient]" :doctors="doctors" @save="handleSave"
                @close="showForm = false" :preselected-patient="currentPatient" />
        </div>

    </div>
</template>
