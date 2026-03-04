<template>
  <div class="app-wrapper">
    <Title />

    <div class="controls-section">
      <SearchBar @search="handleSearch" @clear="handleClear" class="w-full max-w-[300px]" />

      <div class="selects-row">
        <select
          id="type-select"
          name="type"
          v-model="selectedType"
          @change="handleTypeChange"
          class="md-select"
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Series</option>
        </select>

        <select
          id="genre-select"
          name="genre"
          v-model="selectedGenre"
          @change="handleGenreChange"
          class="md-select"
        >
          <option :value="null">All Genres</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="content.length > 0 && !isLoading" class="cards-grid">
      <div v-for="item in content" :key="item.id" class="card group">
        <img
          v-lazy="item.poster_path ? 'https://image.tmdb.org/t/p/w500' + item.poster_path : 'https://placehold.co/300x450/000000/FFFFFF/png?text=No+Image'"
          :alt="item.title || item.name"
          class="card-img"
        >
        <div class="card-content">
          <h3 class="card-title" v-html="(item.original_language !== 'en' ? (item.title || item.name) : (item.original_title || item.original_name))"></h3>
          <p class="card-year">{{ getYear(item.release_date || item.first_air_date) }}</p>
          <p class="card-overview" v-html="item.overview !== '' ? item.overview : 'No description available'"></p>
          <VoteAverage :rating="item.vote_average" />
        </div>
      </div>
    </div>
    <p v-else-if="!isLoading" class="no-content">No content found</p>
    <Pagination v-if="content.length > 0" :currentPage="currentPage" :totalPages="totalPages" @change-page="changePage" />
    <Spinner v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import Title from './components/Title.vue';
  import SearchBar from './components/SearchBar.vue';
  import VoteAverage from './components/VoteAverage.vue';
  import Pagination from './components/Pagination.vue';
  import Spinner from './components/Spinner.vue';

  interface ContentItem {
    id: number;
    poster_path: string;
    original_language: string;
    original_title?: string;
    original_name?: string;
    title?: string;
    name?: string;
    overview: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
  }

  interface Genre {
    id: number;
    name: string;
  }

  const apiKey: string = import.meta.env.VITE_APP_API_KEY;

  const content = ref<ContentItem[]>([]);
  const genres = ref<Genre[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchQuery = ref('');
  const isLoading = ref(false);

  const selectedType = ref<'movie' | 'tv'>('movie');
  const selectedGenre = ref<number | null>(null);

  const fetchGenres = () => {
    const url = `https://api.themoviedb.org/3/genre/${selectedType.value}/list`;
    axios.get(url, {
      params: {
        api_key: apiKey,
        language: 'en-US'
      }
    }).then(response => {
      genres.value = response.data.genres;
    }).catch(error => {
      console.error('Error fetching genres:', error);
    });
  };

  const fetchContent = (page: number = 1) => {
    isLoading.value = true;
    let url = '';
    const params: any = {
      api_key: apiKey,
      language: 'en-US',
      page,
    };

    if (searchQuery.value) {
      url = `https://api.themoviedb.org/3/search/${selectedType.value}`;
      params.query = searchQuery.value;
    } else {
      url = `https://api.themoviedb.org/3/discover/${selectedType.value}`;
      params.sort_by = 'popularity.desc';
      if (selectedGenre.value) {
        params.with_genres = selectedGenre.value;
      }
    }

    axios.get(url, { params })
      .then((response) => {
        content.value = response.data.results;
        currentPage.value = page;
        totalPages.value = Math.min(response.data.total_pages, 500);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const handleSearch = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1;
    fetchContent(1);
  };

  const handleClear = () => {
    searchQuery.value = '';
    fetchContent(1);
  };

  const handleTypeChange = () => {
    selectedGenre.value = null;
    currentPage.value = 1;
    searchQuery.value = '';
    fetchGenres();
    fetchContent(1);
  };

  const handleGenreChange = () => {
    currentPage.value = 1;
    searchQuery.value = '';
    fetchContent(1);
  };

  const changePage = (page: number) => {
    fetchContent(page);
  };

  const getYear = (date?: string) => {
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  onMounted(() => {
    fetchGenres();
    fetchContent();
  });
</script>


<style scoped>
  /* ── Layout ────────────────────────────────────────────── */
  .app-wrapper {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px 12px 48px;
    text-align: center;
  }

  .controls-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    width: 100%;
  }

  .selects-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  @media (min-width: 640px) {
    .selects-row {
      flex-direction: row;
      justify-content: center;
    }
  }

  /* ── Material Select ────────────────────────────────────── */
  .md-select {
    appearance: none;
    -webkit-appearance: none;
    background-color: var(--md-surface-2);
    color: var(--md-on-surface);
    border: none;
    border-bottom: 2px solid var(--md-border);
    border-radius: var(--md-radius-s) var(--md-radius-s) 0 0;
    padding: 10px 36px 10px 14px;
    font-family: 'Roboto', sans-serif;
    font-size: 0.9375rem;
    font-weight: 400;
    width: 100%;
    max-width: 300px;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.6)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .md-select:focus {
    border-bottom-color: var(--md-primary);
  }
  .md-select option {
    background-color: var(--md-surface-2);
    color: var(--md-on-surface);
  }

  /* ── Cards Grid ────────────────────────────────────────── */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    width: 100%;
    justify-items: center;
  }

  @media (max-width: 479px) {
    .cards-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ── Material Card ─────────────────────────────────────── */
  .card {
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 450px;
    border-radius: var(--md-radius-l);
    overflow: hidden;
    box-shadow: var(--md-elevation-4);
    background-color: var(--md-surface);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  .card:hover {
    box-shadow: var(--md-elevation-8);
    transform: translateY(-2px);
  }

  .card-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.45s ease;
  }

  .group:hover .card-img {
    opacity: 0;
  }

  .card-content {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    background-color: var(--md-surface);
    padding: 16px;
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .group:hover .card-content {
    opacity: 1;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--md-on-surface);
    margin: 0 0 6px;
    line-height: 1.4;
  }

  .card-year {
    font-size: 0.8125rem;
    color: var(--md-on-surface-2);
    margin: 0 0 10px;
  }

  .card-overview {
    font-size: 0.875rem;
    color: var(--md-on-surface-2);
    line-height: 1.55;
    margin: 0 0 12px;
  }

  /* ── Scrollbar ─────────────────────────────────────────── */
  .card-content::-webkit-scrollbar {
    width: 4px;
  }
  .card-content::-webkit-scrollbar-track {
    background: var(--md-surface);
    border-radius: 4px;
  }
  .card-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 4px;
  }

  /* ── No content ────────────────────────────────────────── */
  .no-content {
    text-align: center;
    font-size: 1.125rem;
    color: var(--md-on-surface-2);
    margin-top: 48px;
    letter-spacing: 0.01em;
  }
</style>

