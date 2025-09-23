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
  product_id: number;
  quantity: number;
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
