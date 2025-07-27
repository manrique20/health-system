<template>
    <div class="space-y-4">
        <h2 class="mb-4 text-xl font-semibold text-gray-800">Citas programadas ({{ appointments.length }})</h2>

        <div v-if="appointments.length === 0" class="rounded-lg bg-gray-50 p-8 text-center">
            <p class="text-gray-500">No hay citas programadas para esta fecha</p>
        </div>

        <div v-else class="grid gap-4">
            <div
                v-for="appointment in appointments"
                :key="appointment.id"
                class="rounded-lg border-l-4 bg-white p-6 shadow-md"
                :class="{
                    'border-green-500': appointment.status === 'confirmed',
                    'border-yellow-500': appointment.status === 'scheduled',
                    'border-red-500': appointment.status === 'cancelled',
                }"
            >
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800">
                            {{ appointment.patient?.name }}
                        </h3>
                        <p class="mt-1 text-gray-600"><span class="font-medium">Doctor:</span> {{ appointment.doctor?.name }}</p>
                        <p class="text-gray-600"><span class="font-medium">Motivo:</span> {{ appointment.reason }}</p>
                        <div class="mt-3 flex items-center space-x-4 text-sm">
                            <span class="flex items-center text-gray-500"> 📅 {{ formatDate(appointment.date) }} </span>
                            <span class="flex items-center text-gray-500"> 🕐 {{ appointment.time }} ({{ appointment.duration }} min) </span>
                            <span
                                class="rounded-full px-2 py-1 text-xs font-medium"
                                :class="{
                                    'bg-green-100 text-green-800': appointment.status === 'confirmed',
                                    'bg-yellow-100 text-yellow-800': appointment.status === 'scheduled',
                                }"
                            >
                                {{ appointment.status === 'confirmed' ? 'confirmado' : 'programado' }}
                            </span>
                        </div>
                    </div>

                    <button @click="$emit('cancel', appointment.id)" class="ml-4 font-medium text-red-600 hover:text-red-800">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { DateTime } from 'luxon';

defineProps({
    appointments: {
        type: Array,
        required: true,
    },
});

defineEmits(['cancel']);

const formatDate = (date) => {
    return DateTime.fromISO(date).toFormat('dd/MM/yyyy');
};
</script>
