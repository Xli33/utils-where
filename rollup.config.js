import typescript from '@rollup/plugin-typescript';
// import flatDts from 'rollup-plugin-flat-dts';
import { dts } from 'rollup-plugin-dts';

const plugins = [
  typescript({
    tsconfig: './tsconfig.rollup.json'
  })
];

export default [
  {
    input: 'src/events/index.ts',
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
        format: 'esm'
        // plugins: flatDts({
        //   // entries: {
        //   //   index: {
        //   //     file: 'index.d.ts'
        //   //   }
        //   // },
        //   // file: 'index.d.ts',
        //   tsconfig: {
        //     files: ['src/index.ts']
        //   }
        // })
      }
    ],
    plugins
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es'
      }
    ],
    plugins: [dts()]
  }
  /* {
    input: 'src/validator/index.ts',
    // input: {
    //   validator: 'src/validator.ts'
    // },
    output: [
      {
        file: 'dist/cjs/validator.cjs',
        // dir: 'dist/cjs',
        format: 'cjs'
      },
      {
        file: 'dist/esm/validator.js',
        // dir: 'dist/esm',
        format: 'esm'
        // plugins: flatDts({
        //   // entries: {
        //   //   validator: {
        //   //     file: 'validator.d.ts'
        //   //   }
        //   // },
        //   file: 'validator.d.ts',
        //   moduleName: 'utils-where/validator',
        //   tsconfig: {
        //     files: ['src/validator.ts']
        //   }
        // })
      }
    ],
    plugins
  },
  {
    input: 'src/validator/index.ts',
    output: [
      {
        file: 'dist/validator.d.ts',
        format: 'es'
      }
    ],
    plugins: [dts()]
  } */
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
