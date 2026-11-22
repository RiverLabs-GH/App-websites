# App-websites

The websites for RiverLabs.io apps, one module per app.

## Modules

| Module | App | Status |
|---|---|---|
| [`mark-o/`](mark-o/) | [mark.O](https://github.com/RiverLabs-GH/mark.O), a private, offline Markdown workspace for macOS | Scaffold only, no site yet |

## Layout

```
App-websites/
├── README.md        this file
├── .gitignore
└── <app>/           one folder per app, self-contained
    └── README.md    what the module is, how to run and deploy it
```

Each module is independent: it has its own README, its own dependencies and its own build. Nothing at the root is shared, so one app's site can change without touching another's.

## Adding an app

1. Create a folder named after the app in lower case, with dashes for dots and spaces (`mark.O` becomes `mark-o`).
2. Add a `README.md` to it that covers what the site is, how to run it locally, how to build it and where it deploys.
3. Add a row to the table above.

---

*Copyright © 2026 RiverLabs.io. All rights reserved.*
