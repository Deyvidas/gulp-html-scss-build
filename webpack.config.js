import dotenv from 'dotenv';

dotenv.config();

const mode = process.env.MODE;
const isDev = mode === 'development';

const webpackConf = {
    mode: isDev ? mode : 'production',
    entry: {
        index: './src/ts/index.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
    },
    target: ['node'],
};

export default webpackConf;
