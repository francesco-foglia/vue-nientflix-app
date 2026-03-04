<template>
  <div class="search-bar-wrapper">
    <div class="input-wrap">
      <input
        type="text"
        id="search-input"
        name="search"
        v-model="query"
        @keyup.enter="search"
        placeholder="Search..."
      />
      <button v-if="query" @click="clearSearch" class="clear-btn">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <button @click="search" class="search-btn">
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
  .search-bar-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 300px;
    margin: 20px auto 28px;
  }

  .input-wrap {
    position: relative;
    flex: 1;
  }

  input {
    width: 100%;
    padding: 11px 36px 11px 14px;
    background-color: var(--md-surface-2);
    color: var(--md-on-surface);
    border: none;
    border-bottom: 2px solid var(--md-border);
    border-radius: var(--md-radius-s) var(--md-radius-s) 0 0;
    font-family: 'Roboto', sans-serif;
    font-size: 0.9375rem;
    outline: none;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
  }

  input::placeholder {
    color: var(--md-on-surface-3);
  }

  input:focus {
    border-bottom-color: var(--md-primary);
  }

  .clear-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--md-on-surface-2);
    cursor: pointer;
    padding: 0;
    font-size: 0.875rem;
    line-height: 1;
    outline: none;
  }
  .clear-btn:hover {
    color: var(--md-on-surface);
  }

  .search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    background-color: var(--md-primary);
    color: var(--md-on-primary);
    border: none;
    border-radius: var(--md-radius-m);
    cursor: pointer;
    font-size: 0.9375rem;
    outline: none;
    transition: background-color 0.2s ease, transform 0.15s ease;
    padding: 0;
  }
  .search-btn:hover {
    background-color: var(--md-primary-var);
    transform: scale(1.05);
  }
  .search-btn:active {
    transform: scale(0.97);
  }
</style>
