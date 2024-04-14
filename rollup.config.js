import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/tinychat.js',
    format: 'umd',
    name: 'tinychat',
  },
  plugins: [typescript()],
};
