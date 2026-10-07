import { useCallback, useEffect, useRef } from 'react'

export function useAbortController() {
	const controllerRef = useRef<AbortController | null>(null)
	const isMountedRef = useRef<boolean>(true)

	useEffect(() => {
		isMountedRef.current = true
		return () => {
			isMountedRef.current = false
			controllerRef.current?.abort()
		}
	}, [])

	const start = useCallback(() => {
		const controller = new AbortController()
		controllerRef.current = controller
		return controller.signal
	}, [])

	const abort = useCallback(() => {
		controllerRef.current?.abort()
	}, [])

	const clear = useCallback(() => {
		controllerRef.current = null
	}, [])

	const isMounted = useCallback(() => {
		return isMountedRef.current
	}, [])

	return { start, abort, clear, isMounted }
}
