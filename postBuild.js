import { copyFile } from 'node:fs/promises';
import { glob } from 'glob';
import fs from 'fs-extra';
import chalk from 'chalk';
import { MarkdownTreeParser } from '@kayvan/markdown-tree-parser';
import { marked } from 'marked';
import { codeToHtml } from 'shiki';
import markedShiki from 'marked-shiki';
import { getPathValue } from './dist/esm/index.js';

// 切换工作目录到脚本所在目录
process.chdir(import.meta.dirname);

copyFile('types/events.d.ts', 'dist/events.d.ts').catch((err) => {
  console.warn(`failed to copy src/events.d.ts and the error is:`, err);
});

// 配置路径
const srcDir = 'md/';
const distDir = 'docs/readme/';
// 最终需要生成的菜单结构
let menus;
const suffix = '.txt';

const markedParser = marked.use(
  markedShiki({
    async highlight(code, lang) {
      return await codeToHtml(code, {
        lang,
        theme: 'material-theme-palenight'
        // themes: {
        //   light: 'material-theme-palenight',
        //   dark: 'material-theme-palenight'
        // }
      });
    }
  })
);
const mdParser = new MarkdownTreeParser();

// md 转 html 片段
async function mdToHtml(mdString) {
  return await markedParser.parse(mdString);
}

// 处理readme生成介绍等
async function buildFromReadme(lang, readmePath, sections) {
  const mdContent = await fs.readFile(readmePath, 'utf-8');
  const tree = await mdParser.parse(mdContent);

  const result = await Promise.allSettled(
    sections.map(async (e) => {
      const sections = await Promise.allSettled(
        e.headings.map((h) => mdParser.stringify(mdParser.extractSection(tree, h)))
      );
      const mdString = await mdToHtml(sections.map((e) => e.value).join('\n'));
      return {
        title: e.title,
        route: e.route,
        mdString
      };
    })
  );

  result.forEach((e) => {
    // console.log(e)
    const filePath = distDir + lang + '/' + e.value.title + suffix;
    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, e.value.mdString);
    menus.push({
      name: e.value.title,
      route: e.value.route,
      url: lang + '/' + e.value.title + suffix
    });
  });
}

// 生成 组件 html片段
async function buildComponentHtml(lang) {
  const mdDir = srcDir + lang + '/';
  try {
    // posix: true 确保在 Windows 上也使用 / 分隔符，方便路径处理
    const first = {
        name: 'API',
        sub: []
      },
      files = (await glob('**/*.md', { cwd: mdDir, posix: true })).sort();

    menus.push(first);
    const { name: apiDir, sub: apiSub } = first;

    for (const file of files) {
      const apiUrl = file.replace(/\.md$/, suffix);
      const relativeTxtPath = lang + '/' + apiDir + '/' + apiUrl;

      //  构造菜单
      const each = apiUrl.split('/');

      if (each[1]) {
        let apiSubMenu = apiSub.find((e) => e.name === each[0]);
        if (!apiSubMenu) {
          apiSubMenu = {
            name: each[0],
            sub: []
          };
          apiSub.push(apiSubMenu);
        }
        apiSubMenu.sub.push({
          name: each[1].replace(/\.txt$/, ''),
          url: relativeTxtPath
        });
      } else {
        apiSub.push({
          name: apiUrl.replace(/\.txt$/, ''),
          url: relativeTxtPath
        });
      }

      // 实际写入的文件路径
      const distPath = distDir + relativeTxtPath;

      // 读取并解析
      const mdContent = await fs.readFile(mdDir + file, 'utf-8');
      // const htmlFragment = marked.parse(mdContent)

      const htmlFragment = await mdToHtml(mdContent);

      // 确保目标目录存在（例如 docs/readme/va/1.txt）
      await fs.ensureFile(distPath);

      // 写入文件
      await fs.writeFile(distPath, htmlFragment);
    }
    console.log(chalk.green(`\n${lang}/md下的文件全部解析完成!`));
  } catch (err) {
    console.error(chalk.red(err));
  }
}

fs.rm(distDir, { recursive: true })
  .catch((err) => {
    console.error(chalk.redBright(err));
  })
  .finally(async () => {
    const arr = [
      {
        lang: 'en-US',
        readme: 'README.md',
        main: 'index',
        indexLink: 'index_zh-CN.html',
        indexLinkText: '简体中文',
        sections: [
          {
            title: 'Quick Start',
            route: 'start',
            headings: ['Install']
          }
        ]
      },
      {
        lang: 'zh-CN',
        readme: 'README.zh-CN.md',
        main: 'index_zh-CN',
        indexLink: 'index.html',
        indexLinkText: 'English',
        sections: [
          {
            title: '开始使用',
            route: 'start',
            headings: ['安装']
          }
        ]
      }
    ];
    // 生成不同语言的文档内容
    for (const v of arr) {
      menus = [];
      await buildFromReadme(v.lang, v.readme, v.sections);
      await buildComponentHtml(v.lang);
      fs.writeFileSync(`docs/menus_${v.lang}.json`, JSON.stringify(Object.values(menus)));
      // 写入语言对应index.html
      const templateHTML = fs.readFileSync(srcDir + 'template.html', 'utf-8');
      fs.writeFileSync(
        `docs/${v.main}.html`,
        templateHTML.replace(/<%[^<%>]+%>/g, (m) => getPathValue(v, m.match(/[^<%>]+/)[0]) ?? '')
      );
    }
  });
