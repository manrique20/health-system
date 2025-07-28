<template>
  <div class="modal-form">
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <h2 class="form-title">Nuevo Paciente</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input 
            type="text" 
            v-model="form.name"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Ej: Juan Pérez"
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
            placeholder="paciente@email.com"
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

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            DNI/Identificación (opcional)
          </label>
          <input 
            type="text" 
            v-model="form.dni"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="12345678A"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fecha de nacimiento (opcional)
          </label>
          <input 
            type="date" 
            v-model="form.birthDate"
            :max="maxBirthDate"
            class="w-full border rounded-lg px-3 py-2"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales (opcional)
          </label>
          <textarea 
            v-model="form.notes"
            rows="2"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Alergias, condiciones médicas, etc."
          ></textarea>
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Paciente creado exitosamente
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
            {{ loading ? 'Guardando...' : 'Guardar Paciente' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { DateTime } from 'luxon';

const emit = defineEmits(['save', 'close']);

const form = ref({
  name: '',
  email: '',
  phone: '',
  timezone: '',
  dni: '',
  birthDate: '',
  notes: ''
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

const maxBirthDate = computed(() => DateTime.now().minus({ years: 18 }).toISODate());

const handleSubmit = async () => {
  error.value = '';
  success.value = false;
  
  if (!form.value.name || !form.value.email || !form.value.phone || !form.value.timezone) {
    error.value = 'Por favor complete todos los campos obligatorios';
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    error.value = 'Por favor ingrese un email válido';
    return;
  }
  
  loading.value = true;
  try {
    await emit('save', {
      ...form.value,
      id: Date.now(), 
      createdAt: new Date().toISOString()
    });
    
    success.value = true;
    
    setTimeout(() => {
      form.value = {
        name: '',
        email: '',
        phone: '',
        timezone: '',
        dni: '',
        birthDate: '',
        notes: ''
      };
      emit('close');
    }, 2000);
  } catch (err) {
    error.value = err.message || 'Error al crear el paciente';
  } finally {
    loading.value = false;
  }
};
</script>
