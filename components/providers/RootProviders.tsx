"use client";

import React from 'react'
import {ThemeProvider} from 'next-themes'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function RootProviders({ children }: { children: React.ReactNode }) {
	const [queryClient] = React.useState(() => new QueryClient({}));
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem={true}
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default RootProviders
