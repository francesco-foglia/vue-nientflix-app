<template>
  <div class="2xl:container mx-auto px-[5%] py-10">
    <Title />
    <SearchBar @search="handleSearch" @clear="handleClear" />
    <div v-if="movies.length > 0 && !isLoading" id="app" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      <div v-for="movie in movies" :key="movie.id" class="card relative w-full h-[450px] group">
        <img
          v-lazy="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.original_title"
          class="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:opacity-0 transition-all duration-500"
        >
        <div class="card-content p-4 absolute top-0 left-0 w-full h-full max-h-full overflow-auto bg-[#242424] opacity-0 group-hover:opacity-100 transition-all duration-500">
          <h3 class="card-title" v-html="movie.original_language !== 'en' ? movie.title : movie.original_title"></h3>
          <p class="card-overview" v-html="movie.overview !== '' ? movie.overview : 'No description available'"></p>
          <VoteAverage :rating="movie.vote_average" />
        </div>
      </div>
    </div>
    <p v-else class="text-center">No movies found</p>
    <Pagination v-if="movies.length > 0" :currentPage="currentPage" :totalPages="totalPages" @change-page="changePage" />
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

  interface Movie {
    id: number;
    poster_path: string;
    original_language: string;
    original_title: string;
    title: string;
    overview: string;
    vote_average: number;
  }

  const apiKey: string = import.meta.env.VITE_APP_API_KEY;

  const movies = ref<Movie[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchQuery = ref('');
  const isLoading = ref(false);

  const fetchMovies = (page: number = 1, query: string = '') => {
    isLoading.value = true;
    const url = query
      ? 'https://api.themoviedb.org/3/search/movie'
      : 'https://api.themoviedb.org/3/discover/movie';

    axios.get(url, {
      params: {
        language: 'en-US',
        page,
        query,
        sort_by: 'popularity.desc',
        api_key: apiKey
      }
    })
      .then((response) => {
        movies.value = response.data.results;
        currentPage.value = page;
        totalPages.value = query ? response.data.total_pages : 500;
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
    fetchMovies(1, query);
  };

  const handleClear = () => {
    searchQuery.value = '';
    fetchMovies(1);
  };

  const changePage = (page: number) => {
    fetchMovies(page, searchQuery.value);
  };

  onMounted(() => {
    fetchMovies();
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
