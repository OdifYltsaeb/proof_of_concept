const path = require('path');

module.exports = {
    // async redirects() {
    //     return [
    //         {
    //             source: '/',
    //             destination: '/insights',
    //             permanent: false,
    //         },
    //     ];
    // },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    env: {
        API_URL: process.env.API_URL,
        AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
};
