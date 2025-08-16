import type { Product } from './types'

// A component to render a single product card
const ProductCard = ({ product }: { product: Product }) => (
	<figure className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
		<img
			className="w-full h-48 object-cover"
			src={product.thumbnail}
			alt={product.title}
			title={product.title}
			onError={(err) => {
				// Fallback image in case the original fails to load,
				// keep in mind that we are using a free public API and we are fetching a lot of images
				// in one go, in a short amount of time. This placeholder image is a lot more attractive
				// than a broken image.
				const target = err.target as HTMLImageElement
				target.onerror = null
				target.src = `https://placehold.co/400x300/e2e8f0/4a5568?text=No+Image`
			}}
		/>
		<section className="p-6">
			<h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
				{product.title}
			</h3>
			<p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
				{product.description}
			</p>
			<div className="flex justify-between items-center">
				<p className="text-lg font-semibold text-blue-600">
					${product.price.toFixed(2)}
				</p>
				<span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
					{product.category}
				</span>
			</div>
		</section>
	</figure>
)

export default ProductCard
