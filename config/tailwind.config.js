/** @type {import('tailwindcss').Config} */
export default {
  // Just-In-Time compilation mode:
  // https://v2.tailwindcss.com/docs/just-in-time-mode
  mode: 'jit',
  // Set of files using TailwindCSS classes. TW will use these paths to find
  // usages of TW CSS classes, so it only compiles the minimal set of them
  // being used by the application (when JIT mode is enabled)
  // https://tailwindcss.com/docs/content-configuration
  content: [
    './**/*.{js,jsx,ts,tsx}',
    '../**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('postcss-nested'),
    require('autoprefixer')
  ]
}
