// Extra type utilities to make objects more convenient to work with.
// https://stackoverflow.com/a/67452316

type ValueOf<T> = T[keyof T];

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj) as Array<T[keyof T]>;
}

function entries<T extends object>(obj: T): Entries<T> {
  // biome-ignore lint/suspicious/noExplicitAny: hacking around typescript
  return Object.entries(obj) as any;
}

export { entries, keys, values };
export type { Entries, ValueOf };
