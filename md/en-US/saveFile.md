# saveFile

save file to local

```js
import { saveFile } from 'utils-where';

// save file from string
saveFile('hello world', 'hw.txt');

// save file from blob
fetch('audio/1.mp3').then(async (res) => {
  const blob = await res.blob();
  saveFile(blob, 'audio.mp3');
});

// save file from url
saveFile('movie/1.ts', 'movie.ts', true);
```

- type

```ts
saveFile(content: string | Blob, fileName: string, ext?: string, isUrl?: boolean, type?: string): void
```
