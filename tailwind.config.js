/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.{js,jsx,ts,tsx}",
    "./templates/**/*.html.twig",
    './vendor/symfony/twig-bridge/Resources/views/Form/*.html.twig',
    "./node_modules/flowbite/**/*.js",
      "./src/Form/**/*.php",
  ],
  theme: {
    extend: {
      colors: {
        'theme-primary': '#8750f7',
        'theme-primary-1': '#2400ff',
        'theme-primary-2': '#9b8dff',
        'theme-primary-3': '#4654f9',
        'theme-accent-1': '#0f0715',
        'theme-secondary': '#2a1454',
        'theme-black-2': '#050709',
        'theme-accent-2': '#140c1c',
        'theme-white': '#ffffff',
        'body': '#dddddd'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

