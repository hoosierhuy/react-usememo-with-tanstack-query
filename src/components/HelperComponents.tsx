// --- Helper Components goes in this file ---

// A simple loading spinner component
export const Spinner = () => (
	<figure className="flex justify-center items-center h-full">
		<figcaption className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></figcaption>
	</figure>
)

// A component to display error messages
export const ErrorDisplay = ({ message }: { message: string }) => (
	<div
		className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
		role="alert"
	>
		<strong className="font-bold">
			An error occurred while fetching products
		</strong>
		<span className="block sm:inline">{message}</span>
	</div>
)
