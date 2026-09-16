export type ShopProductStockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: "PIN" | "PATCH" | "STICKER" | "ACCESSORY" | "APPAREL" | "OTHER";
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: ShopProductStockStatus;
  isAvailable: boolean;
  imageUrl: string;
  imageFileName: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type PublicShopProductsResponse = {
  code: string;
  message: string;
  data: ShopProduct[];
};

export type PublicShopProductResponse = {
  code: string;
  message: string;
  data: ShopProduct;
};

export type ShopOrder = {
  id: string;
  orderNumber: string;
  quantity: number;
  subtotal: number;
  taxAmount: number;
  platformFee: number;
  total: number;
  checkoutToken: string;
};

export type CreateShopOrderPayload = {
  productId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentMethod: "DELIVERY" | "PICKUP";
  deliveryAddress: string | null;
  customerNotes: string | null;
  paymentMethod: "CASH" | "ONLINE";
  paymentGateway: "XENDIT" | "PAYPAL" | null;
};

export type PaymentFeePolicies = Record<
  "XENDIT" | "PAYPAL",
  { percent: number; fixed: number }
>;

export type PaymentFeePoliciesResponse = {
  code: string;
  message: string;
  data: PaymentFeePolicies;
};

export type CreateShopOrderResponse = {
  code: string;
  message: string;
  data: ShopOrder;
};
