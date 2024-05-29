<template>
  <div class="text-center mt-3">
    <i v-for="star in fullStars" :key="star" class="fa-solid fa-star"></i>
    <i v-if="hasHalfStar" class="fa-regular fa-star-half-stroke"></i>
    <i v-for="star in emptyStars" :key="star" class="fa-regular fa-star"></i>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({
    rating: {
      type: Number,
      required: true
    }
  });

  const fullStars = computed(() => Math.floor(props.rating / 2));
  const hasHalfStar = computed(() => (props.rating / 2) % 1 !== 0);
  const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0));
</script>

<style scoped>
  i {
    color: #FFD700;
    margin: 0 2px;
  }
</style>
