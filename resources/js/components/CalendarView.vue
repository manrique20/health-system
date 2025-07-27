<template>
    <div class="rounded-lg bg-white p-6 shadow-md">
        <div class="mb-6 flex items-center justify-between">
            <button @click="previousMonth" class="rounded p-2 text-black hover:bg-gray-100">←</button>
            <h2 class="text-xl font-semibold text-black">
                {{ currentMonth.toFormat('MMMM yyyy') }}
            </h2>
            <button @click="nextMonth" class="rounded p-2 text-black hover:bg-gray-100">→</button>
        </div>
        <div class="grid grid-cols-7 gap-1">
            <p v-for="day in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" :key="day" class="py-2 text-center font-semibold text-gray-600">
                {{ day }}
            </p>
            <div
                v-for="day in calendarDays"
                :key="day.date"
                @click="$emit('select-date', day.date)"
                class="min-h-[100px] cursor-pointer rounded border p-2 hover:bg-gray-50"
                :class="{
                    'bg-gray-100': !day.isCurrentMonth,
                    'border-blue-500 bg-blue-50': day.isToday,
                    'bg-yellow-50': day.appointments.length > 0,
                }"
            >
                <div class="text-sm font-medium text-black">{{ day.day }}</div>

                <div class="mt-1 space-y-1">
                    <div v-for="apt in day.appointments.slice(0, 2)" :key="apt.id" class="truncate rounded bg-blue-500 px-1 py-0.5 text-xs">
                        <p>{{ apt.time }} - {{ apt.patient?.name }}</p>
                    </div>

                    <div v-if="day.appointments.length > 2" class="text-xs text-gray-500">
                        <p class="text-black">+{{ day.appointments.length - 2 }} más</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { DateTime } from 'luxon';
import { computed, ref } from 'vue';

const props = defineProps({
    appointments: Array,
});

defineEmits(['select-date']);

const currentMonth = ref(DateTime.now().startOf('month'));

const calendarDays = computed(() => {
    const days = [];
    const start = currentMonth.value.startOf('week');
    const end = currentMonth.value.endOf('month').endOf('week');

    let day = start;
    while (day <= end) {
        const dayAppointments = props.appointments.filter((apt) => apt.date === day.toISODate());

        days.push({
            date: day.toISODate(),
            day: day.day,
            isCurrentMonth: day.month === currentMonth.value.month,
            isToday: day.hasSame(DateTime.now(), 'day'),
            appointments: dayAppointments,
        });

        day = day.plus({ days: 1 });
    }

    return days;
});

const previousMonth = () => {
    currentMonth.value = currentMonth.value.minus({ months: 1 });
};

const nextMonth = () => {
    currentMonth.value = currentMonth.value.plus({ months: 1 });
};
</script>
