import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue) {
    // Leer valor inicial
    let initial = defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        initial = item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error loading localStorage key "${key}":`, error);
    }

    const data = ref(initial);

    watch(
        data,
        (newValue) => {
            try {
                window.localStorage.setItem(key, JSON.stringify(newValue));
            } catch (error) {
                console.error(`Error saving localStorage key "${key}":`, error);
            }
        },
        { deep: true },
    );

    window.addEventListener('storage', (e) => {
        if (e.key === key && e.newValue) {
            try {
                data.value = JSON.parse(e.newValue);
            } catch (error) {
                console.error(`Error syncing localStorage key "${key}":`, error);
            }
        }
    });

    return data;
}
