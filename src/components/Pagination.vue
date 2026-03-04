<template>
  <div class="pagination-wrap">
    <button @click="changePage(1)" :disabled="currentPage === 1">
      <i class="fa-solid fa-angles-left"></i>
    </button>
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
      <i class="fa-solid fa-angle-left"></i>
    </button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
      <i class="fa-solid fa-angle-right"></i>
    </button>
    <button @click="changePage(totalPages)" :disabled="currentPage === totalPages">
      <i class="fa-solid fa-angles-right"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  });

  const emit = defineEmits(['change-page']);

  const changePage = (page: number) => {
    if (page >= 1 && page <= props.totalPages) {
      emit('change-page', page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
</script>

<style scoped>
  .pagination-wrap {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 40px;
    width: 100%;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 50%;
    background-color: var(--md-primary);
    color: var(--md-on-primary);
    font-size: 0.875rem;
    cursor: pointer;
    outline: none;
    transition: background-color 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
  }

  button:hover:not(:disabled) {
    background-color: var(--md-primary-var);
    transform: scale(1.1);
  }

  button:active:not(:disabled) {
    transform: scale(0.95);
  }

  button:focus-visible {
    outline: 2px solid var(--md-primary);
    outline-offset: 2px;
  }

  button:disabled {
    background-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
    transform: none;
  }

  span {
    margin: 0 4px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--md-on-surface-2);
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
</style>
