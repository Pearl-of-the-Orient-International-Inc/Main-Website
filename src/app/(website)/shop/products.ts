export type ShopProduct = {
  id: string
  name: string
  price: number
  image: string
}

export const products: ShopProduct[] = [
  { id: "pearl-chaplain-pin", name: "Pearl Chaplain Pin", price: 250, image: "/products/1.png" },
  { id: "prof-chaplain-pin", name: "Prof. Chaplain Pin", price: 450, image: "/products/2.png" },
  { id: "dilg-pin", name: "DILG Pin", price: 250, image: "/products/3.png" },
  { id: "cross-pin", name: "Cross Pin", price: 250, image: "/products/4.png" },
  { id: "phil-flag-pin", name: "Phil. Flag Pin", price: 250, image: "/products/5.png" },
  { id: "bagong-pilipinas-pin", name: "Bagong Pilipinas Pin", price: 250, image: "/products/6.png" },
  { id: "pearl-chaplain-patch", name: "Pearl Chaplain Patch", price: 350, image: "/products/7.png" },
  { id: "pearl-chaplain-badge-patch", name: "Pearl Chaplain Badge Patch", price: 350, image: "/products/8.png" },
  { id: "pearl-chaplain-sticker", name: "Pearl Chaplain Sticker", price: 150, image: "/products/9.png" },
  { id: "pearl-chaplain-badge-sticker", name: "Pearl Chaplain Badge Sticker", price: 150, image: "/products/10.png" },
  { id: "stola", name: "Stola", price: 2000, image: "/products/11.png" },
  { id: "ring", name: "Ring", price: 400, image: "/products/12.png" },
  { id: "buckle-belt", name: "Buckle Belt", price: 1300, image: "/products/13.png" },
  { id: "tactical-jacket-service", name: "Tactical Jacket Service", price: 1700, image: "/products/14.png" },
]

export const findProduct = (productId: string) =>
  products.find((product) => product.id === productId)
