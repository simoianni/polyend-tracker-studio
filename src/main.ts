import { createApp } from 'vue';
import App from './App.vue';
import VueComp from '@/utils/vuecomp.ts';

const app = createApp(App);
VueComp.appContext = app._context;
app.mount('body');
