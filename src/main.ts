import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import VueLazyLoad from 'vue-lazyload';

const app = createApp(App);

app.use(VueLazyLoad, {
  preLoad: 1.3,
  error: 'https://placehold.co/300x450/000000/000000/webp',
  loading: 'https://placehold.co/300x450/000000/000000/webp',
  attempt: 1
});

app.mount('#app');
