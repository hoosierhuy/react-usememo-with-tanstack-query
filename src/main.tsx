import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// This constant is to satisfy the TypeScript type checker.
const rootElement = document.getElementById('root')

// Establish TanStack environment, including the Query Cache.
const queryClient = new QueryClient()

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
				{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
			</QueryClientProvider>
		</StrictMode>,
	)
} else {
	console.error('Root element not found')
}
