export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    image_url: string | null;
  }
  
  export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    createdAt: string;
  }
  
  export interface AddToCartRequest {
    productId: number;
    quantity: number;
  }
  
  export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    image_url: string | null;
  }