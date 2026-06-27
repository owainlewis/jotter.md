# passage.md — task runner
# Usage: `just <recipe>`. Run `just` to list recipes.

# Default: list available recipes
default:
    @just --list

# Start the web app dev server
dev:
    npm run dev:web
