<template>
  <div class="text-center mt-10">
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
  button {
    margin: 0.3rem;
    padding: 0.3em 0.7em;
    border: none;
    background-color: #E50914;
    color: white;
    cursor: pointer;
  }

  button:focus {
    outline: none;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  span {
    margin: 0 1em;
  }
</style>
