// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontSize: {
      11: '11px',
      xs: '.75rem', // 12px
      tiny: '0.8125rem', // 13px
      sm: '.9rem', // 14px
      base: '1rem',
      17: '17px', // 17px
      lg: '1.125rem',
      xl: '1.25rem',
      22: '1.375rem', // 22px
      '2xl': '1.5rem', // 24px
      '2.25xl': '1.625rem', // 26px
      '2.5xl': '1.75rem', // 28px
      '3xl': '2rem', // 32px
      '3-5xl': '2.25rem',
      '4xl': '2.5rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      // The current designs have small heading texts. Might need to revisit these values
      h1: ['1.75rem', '2.12'], // 28px
      h2: ['1.5rem', '1.875rem'], // 24px
      h3: ['1.25rem', '1.75rem'], // 20px
      h4: ['1rem', '1.5rem'], // 16px (base)
      h5: ['0.875rem', '1.25rem']
    },
    extend: {
      screens: {
        desktop: { min: '1440px' },
        'laptop-lg': { max: '1920px' },
        'laptop-md': { max: '1650px' },
        laptop: { max: '1446px' },
        tablet: { max: '1024px' },
        phone: { max: '812px' }
      },
      fontFamily: {
        DEFAULT: ['Open Sans', 'Roboto Slab', 'sans-serif'],
        sans: ['Open Sans', 'Source Sans Pro', 'sans-serif'],
        roboto: ['Roboto Slab', 'sans-serif'],
        arial: ['Arial', 'sans-serif']
      },
      colors: {
        DEFAULT: '#333333',
        primary: '#0094ff', // LF primary blue
        accent: '#003778',
        red: {
          light: '#ff3185',
          DEFAULT: '#ff1414',
          dark: '#c40000'
        },
        blue: {
          pale: '#d2ebff',
          light: '#f5faff',
          DEFAULT: '#0068fa',
          dark: '#003778',
          499: '#4996ff'
        },
        yellow: '#ffba00',
        orange: '#ff7a00',
        green: {
          light: '#008002',
          DEFAULT: '#008002'
        },
        teal: '#46b6c7',
        purple: '#bd6bff',
        odd: '#f9f9f9',
        white: {
          DEFAULT: '#ffffff',
          pale: '#fefefe'
        },
        gray: {
          light: '#f5f5f5',
          DEFAULT: '#e0e0e0',
          dark: '#333333',
          pale: '#818183',
          f83: '#807f83',
          '2d2': '#d2d2d2',
          f9f: '#f9f9f9',
          '9f9': '#f9f9f9',
          fdf: '#dfdfdf',
          '7f7': '#f7f7f7',
          efe: '#efefef',
          fef: '#e6e6e6',
          aaa: '#aaaaaa',
          979: '#797979'
        }
      },
      padding: {
        7.5: '30px'
      },
      borderColor: {
        '0e0': '#e0e0e0'
      },
      width: {
        '14p': '14%',
        100: '6.25rem', // 100px
        800: '50rem' // 800px
      },
      height: {
        100: '6.25rem' // 100px
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/line-clamp')]
};
