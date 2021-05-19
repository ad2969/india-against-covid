/* config-overrides.js */

module.exports = (config) => {
	// add sass loader
	// allow global vars (https://stackoverflow.com/questions/44345881/using-webpack-to-prepend-variables-for-scss)
	// js sharing (https://til.hashrocket.com/posts/sxbrscjuqu-share-scss-variables-with-javascript)
	config.module.rules.push({
		// include all files except those located in folder `styles/*`
		// test: /^((?!styles\/).)*\.scss$/,
		test: /\.module\.scss$/,
		use: [
			{
				loader: "sass-loader",
				query: {
					sourceMap: false,
					additionalData: "@import \"src/styles/main.scss\";",
				},
			},
		],
	});

	return config;
};
