import { /* readdir, unlink , */ copyFile, rename } from 'node:fs/promises';

// to handle .d.ts
// const dist = 'dist/',
//   path = dist + 'cjs/';
// readdir(path)
//   .then((arr) => {
//     console.log(arr);
//     const exts = Object.entries({
//       '.js': {
//         reg: /.js$/,
//         newExt: '.cjs'
//       },
/* //       '.d.ts': { maybe unnecessary to rename .d.ts to .d.cts
//         reg: /.d.ts$/,
//         newExt: '.d.cts'
//       } */
//     });

//     arr.forEach((e) => {
//       exts.forEach((ext) => {
//         e.endsWith(ext[0]) && rename(path + e, path + e.replace(ext[1].reg, ext[1].newExt));
//       });
//     });
//   })
//   .catch((err) => {
//     console.error('read the dist directory failed, ' + err);
//   });

// // remove the unecessary
// unlink(dist + 'tsconfig.tsbuildinfo').catch(() => {});
// unlink(dist + 'tsconfig.esm.tsbuildinfo').catch(() => {});

copyFile('types/events.d.ts', 'dist/events.d.ts').catch((err) => {
  console.warn(`failed to copy src/events.d.ts and the error is:`, err);
});

['index.d.ts', 'validator.d.ts'].forEach((e) => {
  rename('dist/esm/' + e, 'dist/' + e).catch((err) => {
    console.warn(`failed to move ${e} and the error is:`, err);
  });
});
