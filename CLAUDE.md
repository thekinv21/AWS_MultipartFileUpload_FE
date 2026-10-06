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

### HTTP Requests & Data Fetching

- Use `@tanstack/react-query` hooks (`useQuery`, `useMutation`) for all server interactions and data fetching.
- Encapsulate data-fetching logic inside custom hooks located in `src/hooks/` or feature-specific hook files.
- Define proper `queryKey` arrays structured logically (e.g., `['users', userId]`).
- Handle loading and error states explicitly using Mantine UI components (`Loader`, `Alert`, `Skeleton`).

### Forms & Validation

- **Always** use `react-hook-form` combined with `zod` and `@hookform/resolvers/zod` for forms.
- Define explicit Zod schemas for form data prior to creating form components.
- Infer Form type values from the Zod schema:
  ```typescript
  type FormValues = z.infer<typeof schema>
  ```
- Use `Controller` from `react-hook-form` when integrating with Mantine form fields (e.g., `TextInput`, `Select`, `Checkbox`).

### UI & Design System

- Use Mantine UI components for all layout, interaction, and styling needs.
- Rely on Mantine's theme system, props, and styling utilities (such as `Group`, `Stack`, `Grid`, `Container`, `Button`, `Text`) instead of raw CSS or inline styles where possible.
- Ensure application root is wrapped with `MantineProvider`.

### Icons

- Use icons exclusively from `lucide-react`.
- Pass icon components directly into Mantine props where supported (e.g., `leftSection={<IconPlus size={16} />}`).

### Global State Management

- Use `jotai` strictly for global or shared client-side UI state. Do not store server state in Jotai atoms (use `react-query` for server state).
- Keep atoms modular and define them in `src/store/` or within feature folders.
- Use `useAtom`, `useAtomValue`, or `useSetAtom` appropriately to minimize unnecessary re-renders.

### Form Integration Pattern (Mantine + React Hook Form + Zod)

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack, TextInput } from '@mantine/core'
import { Mail } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const userSchema = z.object({
	email: z.string().email('Invalid email address'),
})

type UserFormValues = z.infer<typeof userSchema>

export function UserForm() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: { email: '' },
	})

	const onSubmit = (data: UserFormValues) => {
		/**
		 * Process form data or trigger react-query mutation
		 */
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap='md'>
				<Controller
					name='email'
					control={control}
					render={({ field }) => (
						<TextInput
							{...field}
							label='Email Address'
							placeholder='user@example.com'
							leftSection={<Mail size={16} />}
							error={errors.email?.message}
						/>
					)}
				/>
				<Button type='submit'>Submit</Button>
			</Stack>
		</form>
	)
}
```

### Global State Pattern

```typescript
/**
 * src/store/UiAtom.ts
 */
import { atom } from 'jotai'

export const sidebarOpenAtom = atom<boolean>(false)
```

### Data Fetching Pattern

```tsx
import { Alert, Loader, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'

export function UserProfile({ userId }: { userId: string }) {
	const { data, isLoading, error } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => fetchUserById(userId),
	})

	if (isLoading) return <Loader size='sm' />
	if (error)
		return (
			<Alert icon={<AlertCircle size={16} />} color='red'>
				Failed to load user
			</Alert>
		)

	return <Text>{data.name}</Text>
}
```
