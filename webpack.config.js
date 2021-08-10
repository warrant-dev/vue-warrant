const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = env => {
    return {
        entry: "./src/index.ts",
        plugins: [
            new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
        ],

        resolve: {
            extensions: [".ts", ".js"]
        },

        module: {
            rules: [
                // All files with a .ts or .tsx extension will be handled by ts-loader.
                {
                    test: /\.(ts)?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                },
            ]
        },

        output: {
            library: {
                name: "vue-warrant",
                type: "umd"
            },

            filename: "index.js",
            path: path.resolve(__dirname, "dist"),
        },

        externals: {
            vue: "vue",
        }
    }
};
