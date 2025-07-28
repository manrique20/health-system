<template>
    <div class="modal-form">
        <div class="w-full max-w-md rounded-lg bg-white p-6">
            <h2 class="form-title">Nueva Cita</h2>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="mb-1 block text-sm font-medium"> Paciente </label>
                    <select v-model="form.patientId" class="w-full rounded-lg border px-3 py-2 text-black" required>
                        <option value="">Seleccionar paciente</option>
                        <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patient.name }} ({{ patient.timezone }})</option>
                    </select>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium"> Doctor </label>
                    <select v-model="form.doctorId" class="w-full rounded-lg border px-3 py-2 text-black" required>
                        <option value="">Seleccionar doctor</option>
                        <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">{{ doctor.name }} - {{ doctor.specialty }}</option>
                    </select>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium"> Fecha </label>
                    <input type="date" v-model="form.date" :min="minDate" class="w-full rounded-lg border px-3 py-2" required />
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium"> Hora </label>
                    <input type="time" v-model="form.time" step="900" class="w-full rounded-lg border px-3 py-2" required />
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium"> Duración </label>
                    <select v-model.number="form.duration" class="w-full rounded-lg border px-3 py-2">
                        <option :value="15">15 minutos</option>
                        <option :value="30">30 minutos</option>
                        <option :value="45">45 minutos</option>
                        <option :value="60">1 hora</option>
                    </select>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium"> Motivo de consulta </label>
                    <textarea v-model="form.reason" rows="3" class="w-full rounded-lg border px-3 py-2" required></textarea>
                </div>

                <div v-if="error" class="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    {{ error }}
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" @click="$emit('close')" class="general-cancel-button">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                        {{ loading ? 'Guardando...' : 'Guardar Cita' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useAppointments } from '@/composables/useAppointments';
import { DateTime } from 'luxon';
import { computed, ref } from 'vue';
const props = defineProps({
    patients: Array,
    doctors: Array,
});

const emit = defineEmits(['save', 'close']);

const { checkOverlap } = useAppointments();

const form = ref({
    patientId: '',
    doctorId: '',
    date: DateTime.now().toISODate(),
    time: '09:00',
    duration: 30,
    reason: '',
});

const loading = ref(false);
const error = ref('');

const minDate = computed(() => DateTime.now().toISODate());

const handleSubmit = async () => {
    error.value = '';

    const hour = parseInt(form.value.time.split(':')[0]);
    if (hour < 9 || hour >= 17) {
        error.value = 'Las citas deben ser entre 9:00 y 17:00';
        return;
    }

    if (checkOverlap(form.value.date, form.value.time, form.value.duration, form.value.doctorId)) {
        error.value = 'La cita se superpone con otra existente';
        return;
    }

    const patient = props.patients.find((p) => p.id === form.value.patientId);
    const doctor = props.doctors.find((d) => d.id === form.value.doctorId);

    loading.value = true;
    try {
        await emit('save', {
            ...form.value,
            patientTimezone: patient.timezone,
            doctorTimezone: doctor.timezone,
        });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped lang="scss">
.modal-form {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(5, 17, 41, 0.8);
    padding: 20px;
}
</style>
