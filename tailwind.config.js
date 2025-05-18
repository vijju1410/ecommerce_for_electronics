/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af",
        secondary: "#1d4ed8",
      },
      // Add custom modal styling to the theme extension
      boxShadow: {
        'modal': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)', // Shadow for modal
      },
      // Custom modal sizes (optional)
      spacing: {
        'modal-width': '500px', // Custom width for the modal
      },
    },
  },
  plugins: [],
}
