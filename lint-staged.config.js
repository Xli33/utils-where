import { relative } from 'path';

export default {
  '*.{js,ts}': (filenames) => {
    // 过滤要忽略的路径（例如 public 目录）
    const filesToLint = filenames
      .map((e) => relative(process.cwd(), e).replace(/\\/g, '/'))
      .filter((e) => !e.startsWith('public/'));

    return filesToLint.length
      ? [`eslint --cache --cache-location node_modules/.cache/eslint/ ${filesToLint.join(' ')}`]
      : [];
  },

  '*.{js,ts,json,md}': ['prettier --check --ignore-unknown --experimental-cli']
};
