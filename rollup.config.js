import typescript from '@rollup/plugin-typescript';
import flatDts from 'rollup-plugin-flat-dts';

const plugins = [
  typescript({
    tsconfig: './tsconfig.rollup.json'
  })
];

export default [
  {
    input: 'src/events.ts',
    output: [
      {
        file: 'dist/cjs/events.cjs',
        format: 'cjs'
      },
      {
        file: 'dist/esm/events.js',
        format: 'esm'
      }
    ],
    plugins
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.cjs',
        format: 'cjs'
      },
      {
        file: 'dist/esm/index.js',
        format: 'esm',
        plugins: flatDts({
          tsconfig: {
            files: ['src/index.ts']
          }
        })
      }
    ],
    plugins
  }
];

// export default  {
//   input: 'src/index.ts',
//   output: [
//     {
//       file: 'dist/cjs/index.cjs',
//       format: 'cjs',
//     },
//     {
//       file: 'dist/esm/index.js',
//       format: 'es',
//     }
//   ],
//   plugins: [
//     // nodeResolve({
//     //   extensions: ['.mjs', '.js', '.json', '.node', '.ts']
//     // }),
//     typescript(/* {
//       // include: ['env.d.ts', 'src/index.ts'],
//       // exclude: ['__tests__/'],
//       // compilerOptions: {
//       //   rootDir: ,
//       //   outDir: 'dist'
//       //   //     declaration: true,
//       //   //     emitDeclarationOnly: true,
//       //   //     skipLibCheck: true,
//       //   //     target: 'ESNext',
//       //   //     module: 'ESNext',
//       //   //     moduleResolution: 'Bundler'
//       // }
//       // tsconfig: './tsconfig.rollup.json'
//     } */)
//   ]
// };
