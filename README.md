# [g]o [b]attle learn (gblearn)

## what is this?

unclear

## reference

Fetch Pokemon, movesets, etc. from the PVPoke Github. Write both JSON files
(`src/content/_chargedMoves.json`) and TypeScript files
(`src/content/chargedMoves.ts`). The TypeScript files are experimental-ish, but
seem to work fine.

```sh
❯ bun scripts/fetch-gamemaster.ts
```

Fetch the per-cup rankings from the PVPoke Github. Update the files in place.
(This doesn't remove old cups that no longer exist upstream.)

```sh
❯ bun scripts/fetch-metas.ts
```

Development tools:

- lint (uses biome): `bun lint`
- typecheck: `bun tsc`
- format (uses prettier; biome does not yet support plugins for tailwind /
  astro): `bun format`
- test: `bun test`

Maintenance:

- update bun to the latest version: `bun upgrade`
- update dependencies: `bun update`
