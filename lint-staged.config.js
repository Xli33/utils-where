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

  '*.{js,ts,json,md}': (filenames) => [
    `prettier --check --ignore-unknown --experimental-cli ${getRelativePath(filenames)
      .filter((e) => !/CHANGELOG.md|^docs\//.test(e))
      .join(' ')}`
  ]
};
