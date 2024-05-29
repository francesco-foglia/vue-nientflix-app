<template>
  <div class="flex justify-center mt-5 mb-7">
    <div class="relative mr-[10px]">
      <input
        type="text"
        v-model="query"
        @keyup.enter="search"
        placeholder="Search for movies..."
      />
      <button v-if="query" @click="clearSearch" class="absolute top-1/2 right-[10px] -translate-y-1/2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <button @click="search" class="search">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const query = ref('');

  const emit = defineEmits(['search', 'clear']);

  const search = () => {
    emit('search', query.value);
  };

  const clearSearch = () => {
    query.value = '';
    emit('clear');
  };
</script>

<style scoped>
  input {
    padding: 10px;
    padding-right: 32px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    border: none;
    outline: none;
  }

  .search {
    padding: 0.5em 1em;
    background-color: #E50914;
    border-radius: 4px;
  }
</style>
