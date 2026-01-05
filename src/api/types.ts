// API Type Definitions based on Backend API Documentation
// Version: 1.0

// ===================================
// COMMON TYPES
// ===================================

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type ApiError = {
  success: false;
  message: string;
};

// ===================================
// AUTHENTICATION TYPES
// ===================================

export type LoginRequest = {
  mobilenumber: string;
  password: string;
};

export type LoginResponse = {
  success: true;
  access_token: string;
  refresh_token: string;
};

export type RegisterRequest = {
  name: string;
  mobilenumber: string;
  password: string;
};

export type RegisterResponse = {
  success: true;
  message: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = {
  success: true;
  access_token: string;
  refresh_token: string;
  message: string;
};

// ===================================
// USER TYPES
// ===================================

export type Address = {
  _id: string;
  Receiver_Name: string;
  Receiver_MobileNumber: string;
  Address_Line1: string;
  Address_Line2?: string;
  City: string;
  pincode: string;
  label: string; // "Home", "Office", "Other"
};

export type User = {
  _id: string;
  name: string;
  mobilenumber: string;
  role: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
};

export type UserDetailsResponse = {
  success: true;
  message: string;
  user: User;
};

export type AddAddressRequest = {
  Receiver_Name: string;
  Receiver_MobileNumber: string;
  Address_Line1: string;
  Address_Line2?: string;
  City: string;
  pincode: string;
  label: string;
};

export type AddAddressResponse = {
  success: true;
  message: string;
  addresses: Address[];
};

export type EditAddressRequest = Partial<AddAddressRequest>;

export type EditAddressResponse = {
  success: true;
  message: string;
  addresses: Address[];
};

export type DeleteAddressResponse = {
  success: true;
  message: string;
  addresses: Address[];
};

// ===================================
// PRODUCT TYPES
// ===================================

export type ProductImage = {
  url: string;
  secureUrl: string;
  publicId: string;
};

export type SellingPrice = {
  minQuantity: number;
  price: number;
  _id: string;
};

export type ProductVariant = {
  _id: string;
  color?: string;
  size?: string;
  stock: number;
  mrp: number;
  sellingPrices: SellingPrice[];
  images?: ProductImage[];
  isActive: boolean;
  measurement?: {
    value: number;
    unit: string;
  };
  packOf?: number;
  expiry?: string | null;
};

export type Product = {
  _id: string;
  name: string;
  brand: string;
  description?: string;
  category?: string;
  subCategory?: string;
  subSubCategory?: string;
  categoryId?: string;
  subCategoryId?: string;
  subSubCategoryId?: string;
  thumbnail: ProductImage;
  variants: ProductVariant[];
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryWithProducts = {
  categoryId: string;
  categoryName: string;
  products: Product[];
};

export type LandingPageResponse = {
  success: true;
  totalCategories: number;
  data: CategoryWithProducts[];
};

// Subcategory with products (for level 0/1 responses)
export type SubCategoryWithProducts = {
  subCategoryId: string;
  subCategoryName: string;
  products: Product[];
};

// Parent category response (level 0 or 1) - has subcategories
export type ParentCategoryResponse = {
  success: true;
  level: 0 | 1;
  categoryId: string;
  categoryName: string;
  totalSubCategories: number;
  data: SubCategoryWithProducts[];
};

// Leaf category response (level 2) - has products directly
export type LeafCategoryResponse = {
  success: true;
  level: 2;
  categoryId: string;
  categoryName: string;
  totalProducts: number;
  products: Product[];
};

// Union type for category products
export type CategoryProductsResponse =
  | ParentCategoryResponse
  | LeafCategoryResponse;

export type ProductDetailResponse = {
  success: true;
  product: Product;
};

export type SimilarProductsResponse = {
  success: true;
  categoryId: string;
  categoryName: string;
  totalProducts: number;
  products: Product[];
};

export type SearchFilters = {
  q?: string;
  categoryId?: string;
  subCategoryId?: string;
  subSubCategoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest";
  page?: number;
  limit?: number;
};

export type CategoryInfo = {
  _id: string;
  name: string;
  level: number;
};

export type SearchProduct = Product & {
  categoryInfo?: CategoryInfo;
  searchScore?: number;
};

export type SearchProductsResponse = {
  success: true;
  searchQuery?: string;
  filters: {
    categoryId: string | null;
    subCategoryId: string | null;
    subSubCategoryId: string | null;
    brand: string | null;
    priceRange: {
      min: number | null;
      max: number | null;
    };
    inStock: boolean | null;
  };
  sort: string;
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  products: SearchProduct[];
};

export type SearchSuggestion = {
  id?: string;
  name: string;
  thumbnail?: string;
  type: "product" | "brand" | "category";
  level?: number;
  productCount?: number;
};

export type SearchSuggestionsResponse = {
  success: true;
  query: string;
  totalSuggestions: number;
  suggestions: {
    products: SearchSuggestion[];
    brands: SearchSuggestion[];
    categories: SearchSuggestion[];
  };
};

// ===================================
// MIXED PRODUCTS (Infinite Scroll)
// ===================================

export type MixedProductsResponse = {
  success: true;
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: Product[];
};

// ===================================
// ORDER TYPES
// ===================================

export type OrderProduct = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type CreateOrderRequest = {
  products: OrderProduct[];
  address: Omit<Address, "_id">;
};

export type OrderProductDetail = {
  productId: {
    _id: string;
    name: string;
    brand: string;
    thumbnail: ProductImage;
  };
  variantId: string;
  quantity: number;
  price: number;
  _id: string;
};

export type OrderUserInfo = {
  _id: string;
  name: string;
  email?: string;
  mobilenumber: string;
};

export type OrderStatus = "Placed" | "Shipped" | "delivered" | "cancelled";

export type Order = {
  _id: string;
  userId: string | OrderUserInfo;
  products: OrderProductDetail[];
  totalAmount: number;
  address: Address;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderResponse = {
  success: true;
  message: string;
  order: Order;
};

export type OrderSummary = {
  _id?: string; // Backend might not return this
  orderId?: string; // Check if backend returns this instead
  status: OrderStatus;
  totalPrice: number;
  numberOfProducts: number;
  thumbnail: string;
  createdAt: string;
};

export type OrdersListResponse = {
  success: true;
  orders: OrderSummary[];
};

export type OrderDetailRequest = {
  orderId: string;
};

export type OrderDetailResponse = {
  success: true;
  order: Order;
};

export type CancelOrderRequest = {
  orderId: string;
};

export type CancelOrderResponse = {
  success: true;
  message: string;
  order: Order;
};
