// Legacy API functions - Temporary stubs
// This is a placeholder to prevent import errors
// TODO: Refactor screens to use TanStack Query hooks from @api/hooks
import apiClient from "@api/client";

export async function apiMe() {
  const response = await apiClient.get("/user/details");
  return response.data.user;
}

export async function apiGetProductById(id: string) {
  const response = await apiClient.get(`/products/${id}`);
  return response.data.product;
}

// Add other legacy API functions as needed
export const routes = {
  // Placeholder for old routes object
};
