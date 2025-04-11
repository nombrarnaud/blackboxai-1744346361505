<template>
  <nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
    <!-- Version mobile -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        :disabled="currentPage === 1"
        @click="$emit('page-change', currentPage - 1)"
        :class="[
          'relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium',
          currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50'
        ]"
      >
        Précédent
      </button>
      <button
        :disabled="currentPage === totalPages"
        @click="$emit('page-change', currentPage + 1)"
        :class="[
          'relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium',
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50'
        ]"
      >
        Suivant
      </button>
    </div>

    <!-- Version desktop -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <!-- Information sur les pages -->
      <div>
        <p class="text-sm text-gray-700">
          Affichage de la page
          <span class="font-medium">{{ currentPage }}</span>
          sur
          <span class="font-medium">{{ totalPages }}</span>
        </p>
      </div>

      <!-- Boutons de pagination -->
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Bouton Précédent -->
          <button
            :disabled="currentPage === 1"
            @click="$emit('page-change', currentPage - 1)"
            class="relative inline-flex items-center rounded-l-md px-2 py-2"
            :class="[
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:bg-gray-50'
            ]"
          >
            <span class="sr-only">Précédent</span>
            <i class="fas fa-chevron-left h-5 w-5"></i>
          </button>

          <!-- Pages -->
          <template v-for="page in displayedPages" :key="page">
            <!-- Ellipsis -->
            <span
              v-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
            >
              ...
            </span>
            <!-- Numéro de page -->
            <button
              v-else
              @click="$emit('page-change', page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                currentPage === page
                  ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </template>

          <!-- Bouton Suivant -->
          <button
            :disabled="currentPage === totalPages"
            @click="$emit('page-change', currentPage + 1)"
            class="relative inline-flex items-center rounded-r-md px-2 py-2"
            :class="[
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:bg-gray-50'
            ]"
          >
            <span class="sr-only">Suivant</span>
            <i class="fas fa-chevron-right h-5 w-5"></i>
          </button>
        </nav>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}>(), {
  maxVisiblePages: 5
});

defineEmits<{
  (e: 'page-change', page: number): void;
}>();

// Calculer les pages à afficher
const displayedPages = computed(() => {
  const pages: (number | string)[] = [];
  const { currentPage, totalPages, maxVisiblePages } = props;

  // Si le nombre total de pages est inférieur ou égal au nombre maximum de pages visibles
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Toujours afficher la première page
  pages.push(1);

  // Calculer la plage de pages autour de la page courante
  let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
  let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);

  // Ajuster si on est proche du début
  if (start > 2) {
    pages.push('...');
  }

  // Ajouter les pages du milieu
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Ajuster si on est proche de la fin
  if (end < totalPages - 1) {
    pages.push('...');
  }

  // Toujours afficher la dernière page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
});
</script>

<style scoped>
/* Animation pour les transitions de page */
.page-enter-active,
.page-leave-active {
  @apply transition-opacity duration-200;
}

.page-enter-from,
.page-leave-to {
  @apply opacity-0;
}

/* Style pour les boutons désactivés */
button:disabled {
  @apply cursor-not-allowed opacity-50;
}

/* Hover effect pour les boutons actifs */
button:not(:disabled):hover {
  @apply bg-gray-50;
}

/* Focus styles */
button:focus {
  @apply outline-none ring-2 ring-offset-2 ring-primary-500;
}

/* Style actif pour la page courante */
.active-page {
  @apply bg-primary-600 text-white;
}
</style>
