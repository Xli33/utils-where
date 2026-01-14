# saveFile

保存文件到本地

```js
import { saveFile } from 'utils-where';

// 从字符串保存
saveFile('hello world', 'hw.txt');

// 从 blob 保存
fetch('audio/1.mp3').then(async (res) => {
  const blob = await res.blob();
  saveFile(blob, 'audio.mp3');
});

// 从 url 保存
saveFile('movie/1.ts', 'movie.ts', true);
```

- type

```ts
saveFile(content: string | Blob, fileName: string, ext?: string, isUrl?: boolean, type?: string): void
```
