export type Category = {
  id?: string;
  slug: string;
  name: string;
  image: string;
};

export type Collection = {
  id?: string;
  slug: string;
  name: string;
};

export type Variant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: string;
  category: string;
  collection: string;
  price: number;
  compareAt?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  salesCount: number;
  images: string[];
  variants: Variant[];
  details: {
    fit: string;
    composition: string;
    measures: string;
    shipping: string;
    returns: string;
  };
};

export type CartItem = {
  product: Product;
  variant: Variant;
  quantity: number;
};

export type AdminOrder = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
};
