export interface CatalogueProduct {
  name: string
  estimatedPrice: number
  category: string
  unit: string
  sourceName: 'Keells' | 'Cargills' | 'Arpico' | 'SPAR'
  sourceUrl: string
  capturedOn: string
}

// Starter estimates captured from public Sri Lankan supermarket pages.
// These are suggestions only: the user can replace the estimate with the receipt price.
export const productCatalogue: CatalogueProduct[] = [
  { name: 'Richlife Full Cream Fresh Milk UHT 180ml', estimatedPrice: 140, category: 'Dairy', unit: 'packet', sourceName: 'Keells', sourceUrl: 'https://www.keellssuper.com/productDetail?itemcode=83732', capturedOn: '2026-11-24' },
  { name: 'Highland Vanilla Milk UHT 180ml', estimatedPrice: 120, category: 'Dairy', unit: 'packet', sourceName: 'Keells', sourceUrl: 'https://www.keellssuper.com/productDetail?itemcode=102067', capturedOn: '2026-11-24' },
  { name: 'CIC White Basmathi Rice 1kg', estimatedPrice: 740, category: 'Grains', unit: 'kg', sourceName: 'Keells', sourceUrl: 'https://www.keellssuper.com/productDetail?itemcode=6545', capturedOn: '2026-11-24' },
  { name: 'Alli String Hopper Flour White Rice 1kg', estimatedPrice: 405, category: 'Grains', unit: 'kg', sourceName: 'Keells', sourceUrl: 'https://www.keellssuper.com/productDetail?itemcode=125823', capturedOn: '2026-11-24' },
  { name: 'Turkey Basmati Rice 2kg', estimatedPrice: 2800, category: 'Grains', unit: 'packet', sourceName: 'Cargills', sourceUrl: 'https://cargillsonline.com/Web/ProductDetails?ID=wVWzOhLXNDYsM6xwnqgiYg%3D%3D', capturedOn: '2026-11-24' },
  { name: 'Good Harvest Tomato 500g', estimatedPrice: 405, category: 'Food', unit: 'packet', sourceName: 'Cargills', sourceUrl: 'https://cargillsonline.com/Web/ProductDetails?ID=htGlIYpyTgh6oYATUBe57A%3D%3D', capturedOn: '2026-11-24' },
  { name: 'Big Onion 500g', estimatedPrice: 190, category: 'Food', unit: 'packet', sourceName: 'Cargills', sourceUrl: 'https://cargillsonline.com/Web/ProductDetails?ID=htGlIYpyTgh6oYATUBe57A%3D%3D', capturedOn: '2026-11-24' },
  { name: 'Carrot 500g', estimatedPrice: 145, category: 'Food', unit: 'packet', sourceName: 'Cargills', sourceUrl: 'https://cargillsonline.com/Web/ProductDetails?ID=htGlIYpyTgh6oYATUBe57A%3D%3D', capturedOn: '2026-11-24' },
  { name: 'Coconut 3 pieces', estimatedPrice: 495, category: 'Food', unit: 'item', sourceName: 'Cargills', sourceUrl: 'https://cargillsonline.com/Web/ProductDetails?ID=htGlIYpyTgh6oYATUBe57A%3D%3D', capturedOn: '2026-11-24' },
  { name: 'Sudhi Fresh Milk 1L', estimatedPrice: 523, category: 'Dairy', unit: 'litre', sourceName: 'Arpico', sourceUrl: 'https://arpicosupercentre.com/tabloid/uploads/catalog_1792396418_04811e52.pdf', capturedOn: '2026-11-24' },
  { name: "St. Clair's Black Tea 200g", estimatedPrice: 580, category: 'Food', unit: 'packet', sourceName: 'Arpico', sourceUrl: 'https://arpicosupercentre.com/tabloid/uploads/catalog_1792396418_04811e52.pdf', capturedOn: '2026-11-24' },
  { name: 'Nestomalt Family Pack 600g', estimatedPrice: 1008, category: 'Food', unit: 'packet', sourceName: 'Arpico', sourceUrl: 'https://arpicosupercentre.com/tabloid/uploads/catalog_1792396418_04811e52.pdf', capturedOn: '2026-11-24' },
  { name: 'Kotmale UHT Fresh Milk Full Cream 1L', estimatedPrice: 550, category: 'Dairy', unit: 'litre', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/liquid-milk', capturedOn: '2026-11-24' },
  { name: 'Ambewela Plain Milk 1L', estimatedPrice: 580, category: 'Dairy', unit: 'litre', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/liquid-milk', capturedOn: '2026-11-24' },
  { name: 'SPAR Local Medium Eggs 10 Pack', estimatedPrice: 585, category: 'Dairy', unit: 'packet', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/eggs', capturedOn: '2026-11-24' },
  { name: 'Happy Hen Large Eggs 10 Pack', estimatedPrice: 630, category: 'Dairy', unit: 'packet', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/eggs', capturedOn: '2026-11-24' },
  { name: 'Top Crust Bread 450g', estimatedPrice: 159, category: 'Food', unit: 'item', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/bread', capturedOn: '2026-11-24' },
  { name: 'Sandwich Bread Medium', estimatedPrice: 310, category: 'Food', unit: 'item', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/bread', capturedOn: '2026-11-24' },
  { name: 'New Rathna Nadu Rice 5kg', estimatedPrice: 1150, category: 'Grains', unit: 'packet', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/inventory?page=3', capturedOn: '2026-11-24' },
  { name: 'Star Gold Dhal 1kg', estimatedPrice: 323, category: 'Food', unit: 'kg', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/inventory?page=3', capturedOn: '2026-11-24' },
  { name: 'Dole Banana About 1kg', estimatedPrice: 395, category: 'Food', unit: 'kg', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/inventory?page=3', capturedOn: '2026-11-24' },
  { name: 'Highland Vanilla Yoghurt 90g', estimatedPrice: 80, category: 'Dairy', unit: 'item', sourceName: 'SPAR', sourceUrl: 'https://spar2u.lk/collections/inventory?page=3', capturedOn: '2026-11-24' },
]

const everydayProductNames = [
  ['Milk', 'Sudhi Fresh Milk 1L'],
  ['Eggs', 'SPAR Local Medium Eggs 10 Pack'],
  ['Bread', 'Top Crust Bread 450g'],
  ['Rice', 'New Rathna Nadu Rice 5kg'],
  ['Bananas', 'Dole Banana About 1kg'],
  ['Onions', 'Big Onion 500g'],
  ['Dhal', 'Star Gold Dhal 1kg'],
  ['Yoghurt', 'Highland Vanilla Yoghurt 90g'],
] as const

export const everydayProducts = everydayProductNames
  .flatMap(([label, name]) => {
    const product = productCatalogue.find((candidate) => candidate.name === name)
    return product ? [{ label, product }] : []
  })

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function distance(left: string, right: string) {
  const rows = left.length + 1
  const columns = right.length + 1
  const matrix = Array.from({ length: rows }, () => Array<number>(columns).fill(0))
  for (let row = 0; row < rows; row += 1) matrix[row][0] = row
  for (let column = 0; column < columns; column += 1) matrix[0][column] = column

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      )
      if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1]) {
        matrix[row][column] = Math.min(matrix[row][column], matrix[row - 2][column - 2] + cost)
      }
    }
  }
  return matrix[left.length][right.length]
}

function matchScore(query: string, productName: string) {
  const normalizedName = normalize(productName)
  if (normalizedName === query) return 0
  if (normalizedName.startsWith(query)) return 0.02
  if (normalizedName.includes(query)) return 0.05

  const candidates = [normalizedName, ...normalizedName.split(' ')]
  return Math.min(...candidates.map((candidate) => distance(query, candidate) / Math.max(query.length, candidate.length, 1)))
}

export function matchProducts(value: string, limit = 5) {
  const query = normalize(value)
  if (query.length < 2) return []
  return productCatalogue
    .map((product) => ({ product, score: matchScore(query, product.name) }))
    .filter(({ score }) => score <= 0.58)
    .sort((left, right) => left.score - right.score || left.product.name.localeCompare(right.product.name))
    .slice(0, limit)
    .map(({ product }) => product)
}

export function estimateFor(value: string) {
  return matchProducts(value, 1)[0]
}
