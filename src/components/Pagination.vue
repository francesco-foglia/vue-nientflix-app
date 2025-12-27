<template>
  <div class="flex flex-nowrap justify-center items-center gap-4 mt-10 w-full overflow-hidden">
    <button @click="changePage(1)" :disabled="currentPage === 1" class="shrink-0">
      <i class="fa-solid fa-angles-left"></i>
    </button>
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="shrink-0">
      <i class="fa-solid fa-angle-left"></i>
    </button>
    <span class="mx-1 whitespace-nowrap text-sm">{{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="shrink-0">
      <i class="fa-solid fa-angle-right"></i>
    </button>
    <button @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="shrink-0">
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
    margin: 0;
    padding: 0.3em 0.5em;
    border: none;
    background-color: #E50914;
    color: white;
    cursor: pointer;
    border-radius: 4px;
  }

  button:focus {
    outline: none;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  span {
    margin: 0;
  }
</style>
