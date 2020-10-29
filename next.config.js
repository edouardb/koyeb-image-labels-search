/** @format */

const webpack = require("webpack");

module.exports = {
  rewrites() {
    return [
      {
        source: "/images/:key",
        destination: "/api/images/:key",
      },
    ];
  },
  webpack: (config) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,
      new webpack.DefinePlugin({
        __ALGOLIA_APP_ID__: JSON.stringify(process.env.ALGOLIA_APP_ID),
        __ALGOLIA_SEARCH_API_KEY__: JSON.stringify(
          process.env.ALGOLIA_SEARCH_API_KEY
        ),
        __ALGOLIA_INDICE__: JSON.stringify(process.env.ALGOLIA_INDICE),
      }),
    ];

    return config;
  },
};
