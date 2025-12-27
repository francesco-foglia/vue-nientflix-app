<template>
  <div class="2xl:container mx-auto px-4 md:px-[5%] py-10">
    <Title />

    <div class="flex flex-col mb-6 items-center w-full">
      <SearchBar @search="handleSearch" @clear="handleClear" class="w-full max-w-[300px]" />

      <div class="flex flex-col md:flex-row flex-wrap gap-4 w-full justify-center items-center">
        <select
          id="type-select"
          name="type"
          v-model="selectedType"
          @change="handleTypeChange"
          class="bg-[#242424] text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-red-600 w-full max-w-[300px] md:max-w-[276px]"
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Series</option>
        </select>

        <select
          id="genre-select"
          name="genre"
          v-model="selectedGenre"
          @change="handleGenreChange"
          class="bg-[#242424] text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-red-600 w-full max-w-[300px] md:max-w-[276px]"
        >
          <option :value="null">All Genres</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="content.length > 0 && !isLoading" id="app" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full justify-center">
      <div v-for="item in content" :key="item.id" class="card relative w-full max-w-[300px] h-[450px] mx-auto group">
        <img
          v-lazy="item.poster_path ? 'https://image.tmdb.org/t/p/w500' + item.poster_path : 'https://placehold.co/300x450/000000/FFFFFF/png?text=No+Image'"
          :alt="item.title || item.name"
          class="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:opacity-0 transition-all duration-500"
        >
        <div class="card-content p-4 absolute top-0 left-0 w-full h-full max-h-full overflow-auto bg-[#242424] opacity-0 group-hover:opacity-100 transition-all duration-500">
          <h3 class="card-title" v-html="(item.original_language !== 'en' ? (item.title || item.name) : (item.original_title || item.original_name))"></h3>
          <p class="text-sm text-gray-400 mb-2">{{ getYear(item.release_date || item.first_air_date) }}</p>
          <p class="card-overview" v-html="item.overview !== '' ? item.overview : 'No description available'"></p>
          <VoteAverage :rating="item.vote_average" />
        </div>
      </div>
    </div>
    <p v-else-if="!isLoading" class="text-center text-xl mt-10">No content found</p>
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
  #app {
    font-family: Arial, sans-serif;
  }

  .card {
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .card-title {
    font-size: 1.25em;
    margin: 0;
    margin-bottom: 8px;
  }

  .card-overview {
    font-size: 1em;
    color: grey;
  }

  .card-content::-webkit-scrollbar {
    width: 5px;
  }

  .card-content::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 5px;
  }

  .card-content::-webkit-scrollbar-thumb {
    background: grey;
    border-radius: 5px;
  }
</style>
