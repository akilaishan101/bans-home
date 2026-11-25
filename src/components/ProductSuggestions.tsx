import type { CatalogueProduct } from '../data/productCatalogue'
import { matchProducts } from '../data/productCatalogue'

interface Props {
  query: string
  onSelect: (product: CatalogueProduct) => void
}

export function ProductSuggestions({ query, onSelect }: Props) {
  const suggestions = matchProducts(query)
  if (suggestions.length === 0) return null

  return <div className="product-suggestions" role="listbox" aria-label="Nearest supermarket products">
    {suggestions.map((product) => <button key={`${product.sourceName}-${product.name}`} type="button" onClick={() => onSelect(product)}>
      <span><strong>{product.name}</strong><small>{product.sourceName} website · captured {product.capturedOn}</small></span>
      <em>≈ LKR {product.estimatedPrice.toLocaleString()}</em>
    </button>)}
  </div>
}
