# Goat Sports

A fantasy sports platform for hockey enthusiasts.

## Development

To work on this project locally:

1. Clone this repository
2. Install dependencies with `bun install`
3. Start the development server with `bun run dev`

## Building for Production

To build the project for production:

1. Run `bun run build`
2. The built files will be in the `dist` directory

## Dependency Management with Bun

If you need to refresh your dependencies or resolve lockfile issues, you can delete and recreate the Bun lockfile:

```sh
rm bun.lockb
bun install
```

This will generate a new `bun.lockb` based on your `package.json`.

## Deployment

The project can be deployed to any static hosting service that supports Vite applications.
