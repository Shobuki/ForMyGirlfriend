// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        animation: {
          'bg-pan': 'bg-pan 10s ease infinite',
          'spin-slow': 'spin 8s linear infinite',
          'blink': 'blink 1.5s infinite',
          'float': 'float 6s ease-in-out infinite',
          'float-delayed': 'float 8s ease-in-out infinite',
          'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          // ❌ animate-bounce default dari Tailwind tidak di-override
        },
        keyframes: {
          'bg-pan': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          blink: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.3' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(10deg)' },
          },
          // ❌ Tidak override keyframes bounce
        },
        backgroundSize: {
          '400': '400% 400%',
        },
        backgroundPosition: {
          'center-0': '0% 50%',
        },
        backgroundImage: {
          'romantic': 'linear-gradient(to right, #f9a8d4, #f472b6, #ec4899)',
        },
        fill: {
          'cyan-500': '#06b6d4',
          'cyan-400': '#22d3ee',
          'blue-500': '#3b82f6',
        },
      },
    },
    plugins: [],
  }
  