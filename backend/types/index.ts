export interface Product {
  product_id: string;
  product_name: string;
  product_price: number;
}

export interface Box {
  box_id: string;
  box_name: string;
  box_price: number;
  box_products: Product[];
}

export interface LineItem {
  line_item_id: string;
  box_id: string;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: string;
  order_total_price: number;
  currency: string;
  order_date: string;
  created_at: string;
  shipping_address: string;
  customer_name: string;
  customer_email: string;
  line_items: LineItem[];
}

export interface PickListItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface ProductMappings {
  boxes: Box[];
} 