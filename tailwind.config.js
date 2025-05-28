/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // Asegúrate de incluir tus rutas
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          background: '#EAF6FB',
          card: '#E9E5F6',
          primary: '#B4E2D1',
          primaryHover: '#9ED6C2',
          secondary: '#F7C8C2',
          secondaryHover: '#F4B1AB',
          textMain: '#3A3A3A',
          textSecondary: '#777777',
          inputBg: '#F9F9F9',
          inputBorder: '#DADADA',
          inputFocus: '#B4E2D1',
          selection: '#C9E7F2',
          selectionBorder: '#A4D1E5',
          dialogBorder: '#D7D0EB',
          success: '#D6F5D6',
          error: '#F9C1C1',
          shadow: 'rgba(0, 0, 0, 0.05)',
        },
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      transitionProperty: {
        'bg': 'background-color',
        'border': 'border-color',
        'colors': 'color, background-color, border-color',
      },
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out',
      },
      transitionDuration: {
        'default': '200ms',
      },
    },
  },
  plugins: [],
};
