const daisyui = require('daisyui');

module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/styles/**/*.{css, scss}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat'],
            },
        },
    },
    important: true,
    variants: {
        extend: {
            backgroundColor: ['checked', 'hover'],
            borderColor: ['checked', 'hover'],
            textColor: ['visited', 'hover'],
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: ['bumblebee'],
    }
}
