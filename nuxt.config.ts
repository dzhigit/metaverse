// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },

  plugins: [
    // Подключаем плагин для Supabase
    //'~/plugins/supabase.js'
  ],

  router: {
    middleware: ['auth']
  },

  modules: ['nuxt-telegram-auth']
})