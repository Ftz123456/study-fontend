import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import * as path from 'path';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      proxy: {
        '/api': {
          target: 'http://106.53.179.133:8081',
          // target: 'http://192.168.243.246:8081',
          // target: 'http://localhost:5173',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
