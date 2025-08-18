import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ErrorDisplay, Spinner } from '../HelperComponents'
import ProductCard from './ProductCard'
import type { ApiResponse } from './types'

// --- API Fetching Function ---
// This async function is responsible for fetching the product data from the API.
// TanStack Query will call this function for us.
const fetchProducts = async (): Promise<ApiResponse> => {
	const response = await fetch(
		'https://dummyjson.com/products?limit=101&skip=0&select=title,description,price,brand,category,thumbnail',
	)

	if (!response.ok) {
		throw new Error('Network response was not ok')
	}

	return response.json()
}

// --- Main Component: ProductsList ---
// This component handles the state, fetching, filtering, and rendering of the product list.
const ProductsList = () => {
	const [searchTerm, setSearchTerm] = useState('')

	// useQuery hook from TanStack Query to fetch and manage the data.
	// 'products' is the unique key for this query.
	const { data, error, isLoading }: UseQueryResult<ApiResponse, Error> =
		useQuery({
			queryKey: ['products'],
			queryFn: fetchProducts,
			staleTime: 1000 * 60 * 5, // This means refetch data after 5 minutes, in the background, it's an optional feature of TanStack Query.
		})

	// useMemo hook to optimize filtering.
	// This calculation will only re-run if 'data' or 'searchTerm' changes.
	// I added a TL;DR section at the bottom of this file to explain what
	// would happen if we did not use the useMemo hook, or if we did not
	// manually create a memoized function in a vanilla JS app.
	const filteredProducts = useMemo(() => {
		if (!data?.products) return []

		// Prepare the search term once to be more efficient
		const lowerCasedTerm = searchTerm.trim().toLowerCase()

		// If search term is empty, return all products
		if (!lowerCasedTerm) {
			return data.products
		}

		// Filter products based on title, category, or brand.
		// Optional chaining (?.) is added to prevent errors if a product field is unexpectedly missing,
		// keep in mind that we are using a free public API, a production api would hopefully be more
		// robust.
		return data.products.filter(
			(product) =>
				product.title?.toLowerCase().includes(lowerCasedTerm) ||
				product.category?.toLowerCase().includes(lowerCasedTerm) ||
				product.brand?.toLowerCase().includes(lowerCasedTerm),
		)
	}, [data, searchTerm]) // Dependencies array: the hook re-runs if these values change.

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8">
			<header className="text-center mb-8">
				<h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2">
					Friendly Neighborhood Department Store
				</h2>
				<p className="text-lg text-gray-500">
					Using React, TanStack Query, React.memo, and useMemo hook
				</p>
			</header>

			<section className="mb-8 max-w-2xl mx-auto">
				<input
					type="text"
					placeholder="Search by product name, category, or brand..."
					className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
					value={searchTerm}
					onChange={(evt) => setSearchTerm(evt.target.value)}
				/>
			</section>

			{/* Conditional Rendering based on query state */}
			{isLoading && <Spinner />}
			{error && <ErrorDisplay message={error.message} />}

			{data &&
				(filteredProducts.length > 0 ? (
					<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{filteredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</section>
				) : (
					<section className="text-center py-16">
						<p className="text-2xl text-gray-500">
							No products found for "{searchTerm}"
						</p>
					</section>
				))}
		</div>
	)
}

export default ProductsList

/**
TL;DR
Performance Impact Comparison:
Without useMemo (and if we were to fetch and filter 300 products):

Every component re-render = 300+ string operations
Could cause noticeable lag on slower devices
Potential frame drops during typing.

With useMemo (300 products):
Filtering only happens when search term changes
Smooth user experience even with larger dataset
Better performance on mobile/older devices
Real-World Scenario:
If a user types "phone" in the search box, without useMemo the filtering would run multiple times as they type each letter ("p", "ph", "pho", "phon", "phone"), processing 300 products each time. With useMemo, it only processes once per actual search term change.

The larger your dataset, the more valuable useMemo becomes for expensive operations like filtering, sorting, or complex calculations.
 */
