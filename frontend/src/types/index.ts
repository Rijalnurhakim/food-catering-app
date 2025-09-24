export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  price_at_time: number;
  product_name?: string; // TAMBAHKAN INI
}

export interface Order {
  id: number;
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
