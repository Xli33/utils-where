import { relative } from 'path';

const getRelativePath = (filenames) => filenames.map((e) => relative(import.meta.dirname, e).replace(/\\/g, '/'));

export default {
  '*.{js,ts}': (filenames) => {
    // 过滤要忽略的路径（例如 public 目录）
    const filesToLint = getRelativePath(filenames).filter((e) => !e.startsWith('public/'));

    return filesToLint.length
      ? [`eslint --cache --cache-location node_modules/.cache/eslint/ ${filesToLint.join(' ')}`]
      : [];
  },

  '*.{js,ts,json,md}': (filenames) => {
    const needFormat = getRelativePath(filenames).filter((e) => !/CHANGELOG.md|^public\/|^docs\//.test(e));
    if (!needFormat.length) return [];

    return [`prettier --check --ignore-unknown --experimental-cli ${needFormat.join(' ')}`];
  }
};
