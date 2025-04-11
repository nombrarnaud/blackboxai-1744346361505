<template>
  <div class="loading-spinner" :style="spinnerStyle">
    <!-- Spinner -->
    <div
      class="spinner"
      :class="[color]"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderWidth}px`
      }"
    ></div>

    <!-- Message de chargement -->
    <p
      v-if="message"
      class="loading-message"
      :class="[`text-${color}`]"
      :style="{ marginTop: `${size / 2}px` }"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props
interface Props {
  size?: number;
  color?: 'white' | 'indigo' | 'gray';
  message?: string;
  borderWidth?: number;
  center?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  color: 'indigo',
  message: '',
  borderWidth: 4,
  center: true
});

// Computed
const spinnerStyle = computed(() => {
  if (props.center) {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    };
  }
  return {};
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  border-style: solid;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Variantes de couleur */
.spinner.white {
  border-color: rgba(255, 255, 255, 0.2);
  border-top-color: white;
}

.spinner.indigo {
  border-color: rgba(79, 70, 229, 0.2);
  border-top-color: #4F46E5;
}

.spinner.gray {
  border-color: rgba(107, 114, 128, 0.2);
  border-top-color: #6B7280;
}

/* Message de chargement */
.loading-message {
  font-size: 0.875rem;
  font-weight: 500;
}

.text-white {
  color: white;
}

.text-indigo {
  color: #4F46E5;
}

.text-gray {
  color: #6B7280;
}

/* Animation de rotation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Animation de pulsation pour le message */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-message {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Variantes de taille prédéfinies */
.spinner.sm {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.spinner.md {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}

.spinner.lg {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

/* Support pour le mode sombre */
@media (prefers-color-scheme: dark) {
  .spinner.indigo {
    border-color: rgba(99, 102, 241, 0.2);
    border-top-color: #6366F1;
  }

  .spinner.gray {
    border-color: rgba(156, 163, 175, 0.2);
    border-top-color: #9CA3AF;
  }

  .text-indigo {
    color: #6366F1;
  }

  .text-gray {
    color: #9CA3AF;
  }
}
</style>
