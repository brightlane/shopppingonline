## System Overview

Static site built with a lightweight generation pipeline.

Content is compiled from a structured data source and rendered into pages during build.  
Pages include category hubs, product detail views, and outbound links.

Basic safeguards are in place to ensure:
- valid product identifiers
- consistent page generation
- fallback handling for missing assets

Build output is written to `/dist` and deployed via GitHub Pages.

---

## Usage

Run build:

```bash
node master-orchestrator.js
