/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (vibrant, friendly)
        pink: '#FF6B9D',
        turquoise: '#00D9FF',
        orange: '#FF8A3D',
        purple: '#9B59B6',
        
        // Neutrals
        'bg-light': '#FFFFFF',
        'bg-gray': '#F7F9FA',
        'text-dark': '#1A202C',
        'text-gray': '#718096',
        
        // Accents
        success: '#48BB78',
        border: '#E2E8F0',
        
        // Custom color variants
        'pink-50': '#FEF7F9',
        'pink-100': '#FEEFF3',
        'pink-200': '#FDDDE6',
        'pink-300': '#FCC0D1',
        'pink-400': '#FA9BB8',
        'pink-500': '#FF6B9D',
        'pink-600': '#E55A8A',
        'pink-700': '#CC4A77',
        'pink-800': '#B33A64',
        'pink-900': '#9A2A51',
        
        'turquoise-50': '#F0FDFF',
        'turquoise-100': '#CCF7FF',
        'turquoise-200': '#99EFFF',
        'turquoise-300': '#66E7FF',
        'turquoise-400': '#33DFFF',
        'turquoise-500': '#00D9FF',
        'turquoise-600': '#00B8D9',
        'turquoise-700': '#0097B3',
        'turquoise-800': '#00768D',
        'turquoise-900': '#005567',
        
        'orange-50': '#FFF7F0',
        'orange-100': '#FFEEDD',
        'orange-200': '#FFDDBA',
        'orange-300': '#FFCC97',
        'orange-400': '#FFBB74',
        'orange-500': '#FF8A3D',
        'orange-600': '#E67A37',
        'orange-700': '#CC6A31',
        'orange-800': '#B35A2B',
        'orange-900': '#9A4A25',
        
        'purple-50': '#F5F0F8',
        'purple-100': '#EBD9F1',
        'purple-200': '#D7B3E3',
        'purple-300': '#C38DD5',
        'purple-400': '#AF67C7',
        'purple-500': '#9B59B6',
        'purple-600': '#8B4DA4',
        'purple-700': '#7B4192',
        'purple-800': '#6B3580',
        'purple-900': '#5B296E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}