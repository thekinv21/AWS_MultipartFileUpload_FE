# Project Guidelines & Rules

This repository follows a strict tech stack and architectural guidelines for all web development tasks. Adhere to these instructions when implementing features, refactoring, or generating code.

## Skills

Do not load any skill by default. Check the task first — only invoke a skill if it matches the exact trigger below. Never invoke a skill just because it exists.

- `/architect` — before building something non-trivial with no plan yet
- `/review` — when a feature is done and needs a production check
- `/recover` — when something is broken and the fix isn't obvious
- `/remember` — at the start of a new session to restore context,
  and at the end to save progress

## Session continuity

REQUIRED — do not skip, do not wait to be asked:

- **First action of every session:** run `/remember restore` before doing anything else.
- **Last action of every session:** run `/remember save` before closing.

## Naming

- Component: PascalCase
- Methods/functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE

### UI Component Rules

- **Exclusively use shadcn/ui primitives** (`@/components/ui/*`) for all interactive elements, inputs, forms, overlays, and layout blocks.
- **Do NOT write native HTML form elements** (e.g., do not use raw `<button>`, `<input>`, `<select>`, `<textarea>`, or `<table`>). Always import and render the corresponding shadcn/ui components (`Button`, `Input`, `Select`, `Textarea`, `Table`, etc.).
- **Do NOT introduce or mix other UI libraries** (e.g., no Mantine, Chakra UI, MUI, or HeroUI).
- Combine shadcn components with **Tailwind CSS classes** (`flex`, `grid`, `gap-4`, `space-y-4`) for layouts and positioning.
- Use the `cn()` utility function from `@/lib/utils` whenever merging custom or conditional Tailwind classes.

### HTTP Requests & Data Fetching

- Use `@tanstack/react-query` hooks (`useQuery`, `useMutation`) for all server interactions and data fetching.
- Encapsulate data-fetching logic inside custom hooks located in `src/hooks/` or feature-specific hook files.
- Define proper `queryKey` arrays structured logically (e.g., `['users', userId]`).
- Handle loading and error states explicitly using shadcn/ui components (`Skeleton`, `Alert`, `AlertDescription`, or `Spinner`).

### Forms Validation

- **Always** use `react-hook-form` combined with `zod` and `@hookform/resolvers/zod` for forms.
- Define explicit Zod schemas for form data prior to creating form components.
- Infer Form type values from the Zod schema:
  ```typescript
  type FormValues = z.infer<typeof schema>
  ```
