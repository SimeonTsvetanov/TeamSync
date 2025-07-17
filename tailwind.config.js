module.exports = {
  content: ["./*.html", "./*.js"],
  safelist: [
    "bg-primary-500",
    "bg-primary-600",
    "bg-secondary-500",
    "bg-secondary-600",
    "text-white",
    "rounded-full",
    "shadow-lg",
    // add any other classes you use dynamically
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0ea5e9', // sky-500
          600: '#0284c7', // sky-600
        },
        secondary: {
          500: '#8b5cf6', // violet-500
          600: '#7c3aed', // violet-600
        },
      },
    },
  },
  plugins: [],
};
