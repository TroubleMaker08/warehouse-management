// Product types
type Product = {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

// Order types
type LineItem = {
  lineItemId: string;
  boxId: string;
  boxName: string;
  boxPrice: number;
  quantity: number;
  subItems: Product[];
}

type Order = {
  orderId: string;
  orderDate: string;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  lineItems: LineItem[];
}

type PickListItem = {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

// API Response types
type PackingListResponse = Order[];
type PickListResponse = PickListItem[];

// Export types
export type { Product, LineItem, Order, PackingListResponse, PickListItem, PickListResponse }; 