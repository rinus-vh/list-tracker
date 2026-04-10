# List Tracker — Claude Code instructies

## Projectoverzicht
Een persoonlijke goal/task tracker gebouwd in React + Vite, gehost op GitHub Pages.
Realtime sync via Firebase Firestore, Google login via Firebase Auth, AI coach via Cloudflare Worker.

## Stack
- **React 18** met JSX
- **Vite** als bundler
- **CSS Modules** voor styling (`.module.css` per component)
- **clsx** voor conditionele classNames: `cx(styles.component, condition && styles.modifier)`
- **Firebase SDK v10** (auth + firestore) via npm
- **GitHub Pages** voor hosting (via `gh-pages` branch)

## Projectstructuur
```
src/
├── main.jsx              # React root
├── App.jsx               # Root component, routing tussen auth/app
├── App.module.css
├── firebase.js           # Firebase init, auth, db exports
├── components/
│   ├── Aside/            # Notion-achtige sidebar met lijsten
│   ├── ListItem/         # Enkel item in de aside
│   ├── ThemeCard/        # Groep met taken binnen een lijst
│   ├── TaskRow/          # Individuele taak met tags/deadline
│   ├── Coach/            # AI coach chat interface
│   ├── Notes/            # Notities + bijlagen tab
│   └── modals/           # Alle modals (confirm, list, theme, deadline)
├── hooks/
│   ├── useAuth.js        # Firebase auth state
│   └── useLists.js       # Firestore realtime listener
└── styles/
    ├── tokens.css        # CSS custom properties (kleuren, spacing, radius)
    └── global.css        # Reset + body styles
```

## Naamgevingsconventies
- Componentbestanden: `PascalCase.jsx`
- CSS module bestanden: `PascalCase.module.css`
- Hooks: `camelCase.js` met `use` prefix
- className patroon: `cx(styles.component, condition && styles.modifier)`
- Importeer clsx altijd als: `import cx from 'clsx'`

## CSS conventies
- Gebruik **altijd** CSS Modules — geen inline styles, geen global classes in componenten
- Design tokens leven in `src/styles/tokens.css` en worden geïmporteerd in `global.css`
- Dark mode via `@media (prefers-color-scheme: dark)` in `tokens.css`
- Geen Tailwind, geen styled-components, geen CSS-in-JS

## Componentstructuur
Elk component volgt dit patroon:
```jsx
import cx from 'clsx'
import styles from './ComponentName.module.css'

export function ComponentName({ prop1, prop2 }) {
  return (
    <div className={cx(styles.root, prop1 && styles.active)}>
      ...
    </div>
  )
}
```

## State management
- Geen Redux of Zustand — gewoon React state + context
- Firebase data via custom hooks (`useAuth`, `useLists`)
- Lokale UI state (modals open/dicht, dropdown) in het component zelf

## Externe services
- **Firebase config**: `src/firebase.js`
- **Cloudflare Worker URL**: `https://list-tracker.rvanhofweegen.workers.dev`
- **Anthropic API key**: staat NIET in de code, leeft als secret in Cloudflare Worker
- De Worker verwacht een `uid` veld in de request body voor authenticatie

## Deployment
- GitHub Pages via `gh-pages` package
- Build commando: `npm run build`
- Deploy commando: `npm run deploy`
- Vite base config: `base: '/list-tracker/'` in `vite.config.js`

## Werkwijze voor Claude Code
- Maak GEEN extra folders buiten de structuur hierboven
- Maak GEEN `pages/` folder — dit is geen Next.js project
- Maak GEEN `utils/` folder tenzij expliciet gevraagd
- Splits componenten op een logische manier — één verantwoordelijkheid per component
- Bij twijfel: kleinere componenten zijn beter dan grote
- Gebruik altijd named exports (geen default exports voor componenten)
- Props destructureren in de functiesignatuur

## Bekende datastructuur in Firestore
```
users/{uid}/lists/{listId} {
  id, name, desc, colorIdx, pinned, createdAt,
  tags: [{ id, name, color }],
  themes: [{
    id, name, sub, colorIdx,
    tasks: [{ id, text, tags[], done, deadline }]
  }],
  notes: string,
  attachments: [{ id, name, size, type }]
}
```