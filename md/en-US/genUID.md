## genUID

generate a unique id with given prefix

```ts
import { genUID } from 'utils-where';

// get a random number id without prefix
genUID();

// get a unique id with prefix, should be 'Some' + number less than 1000
genUID('Some', 1000);
```

- type

```ts
genUID(prefix?: string, level?: number, step?: number): string
```
