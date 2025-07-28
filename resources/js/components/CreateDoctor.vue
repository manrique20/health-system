<template>
  <div class="modal-form">
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <h2 class="form-title">Nuevo Doctor</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input 
            type="text" 
            v-model="form.name"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Dr. Roberto Sánchez"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Especialidad
          </label>
          <select v-model="form.specialty" class="w-full border rounded-lg px-3 py-2" required>
            <option value="">Seleccionar especialidad</option>
            <option value="Medicina General">Medicina General</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Cardiología">Cardiología</option>
            <option value="Dermatología">Dermatología</option>
            <option value="Ginecología">Ginecología</option>
            <option value="Traumatología">Traumatología</option>
            <option value="Neurología">Neurología</option>
            <option value="Oftalmología">Oftalmología</option>
            <option value="Psiquiatría">Psiquiatría</option>
            <option value="Odontología">Odontología</option>
            <option value="Otra">Otra especialidad</option>
          </select>
        </div>

        <!-- Especialidad personalizada -->
        <div v-if="form.specialty === 'Otra'">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Especificar especialidad
          </label>
          <input 
            type="text" 
            v-model="form.customSpecialty"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Escriba la especialidad"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input 
            type="email" 
            v-model="form.email"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="doctor@clinica.com"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input 
            type="tel" 
            v-model="form.phone"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="+34 612 345 678"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Número de colegiado
          </label>
          <input 
            type="text" 
            v-model="form.licenseNumber"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="12345"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Zona horaria
          </label>
          <select v-model="form.timezone" class="w-full border rounded-lg px-3 py-2" required>
            <option value="">Seleccionar zona horaria</option>
            <option value="Europe/Madrid">España (Europe/Madrid)</option>
            <option value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</option>
            <option value="America/Mexico_City">México (Mexico City)</option>
            <option value="America/New_York">USA Este (New York)</option>
            <option value="America/Los_Angeles">USA Oeste (Los Angeles)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Hora inicio
            </label>
            <input 
              type="time" 
              v-model="form.startTime"
              class="w-full border rounded-lg px-3 py-2"
              value="09:00"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Hora fin
            </label>
            <input 
              type="time" 
              v-model="form.endTime"
              class="w-full border rounded-lg px-3 py-2"
              value="17:00"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Días de atención
          </label>
          <div class="space-y-2">
            <label v-for="day in days" :key="day.value" class="flex items-center">
              <input 
                type="checkbox" 
                :value="day.value"
                v-model="form.workDays"
                class="mr-2"
              >
              {{ day.label }}
            </label>
          </div>
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Doctor creado exitosamente
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button 
            type="button"
            @click="$emit('close')"
            class="general-cancel-button"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? 'Guardando...' : 'Guardar Doctor' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['save', 'close']);

const days = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' }
];

const form = ref({
  name: '',
  specialty: '',
  customSpecialty: '',
  email: '',
  phone: '',
  licenseNumber: '',
  timezone: '',
  startTime: '09:00',
  endTime: '17:00',
  workDays: [1, 2, 3, 4, 5]
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

const handleSubmit = async () => {
  error.value = '';
  success.value = false;
  
  if (!form.value.name || !form.value.email || !form.value.phone || 
      !form.value.timezone || !form.value.licenseNumber) {
    error.value = 'Por favor complete todos los campos obligatorios';
    return;
  }
  
  if (!form.value.specialty || (form.value.specialty === 'Otra' && !form.value.customSpecialty)) {
    error.value = 'Por favor seleccione o especifique una especialidad';
    return;
  }
  
  if (form.value.workDays.length === 0) {
    error.value = 'Por favor seleccione al menos un día de atención';
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    error.value = 'Por favor ingrese un email válido';
    return;
  }
  
  loading.value = true;
  try {
    const doctorData = {
      ...form.value,
      id: Date.now(),
      specialty: form.value.specialty === 'Otra' ? form.value.customSpecialty : form.value.specialty,
      createdAt: new Date().toISOString()
    };
    
    await emit('save', doctorData);
    
    success.value = true;
    
    setTimeout(() => {
      emit('close');
    }, 2000);
  } catch (err) {
    error.value = err.message || 'Error al crear el doctor';
  } finally {
    loading.value = false;
  }
};
</script>