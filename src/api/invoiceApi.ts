// Invoice API — fetch invoice JSON + download/share invoice PDF
// Uses the shared axios client (auth token attached via interceptor) for JSON,
// and expo-file-system (legacy API) for the authenticated PDF download so we can
// stream the binary straight to disk with the Bearer header attached.
import { AxiosError } from "axios";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import apiClient, { API_BASE_URL } from "@api/client";
import { loadTokens } from "@services/tokenStorage";

// ===================================
// TYPES
// ===================================

export interface InvoiceShopDetails {
  legalName: string;
  brandName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export interface InvoiceCustomerDetails {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pincode: string;
  label?: string;
}

export interface InvoiceItem {
  name: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  invoiceNumber: string;
  orderId: string;
  userId: string;
  shopDetails: InvoiceShopDetails;
  customerDetails: InvoiceCustomerDetails;
  items: InvoiceItem[];
  subtotal: number;
  totalAmount: number;
  paymentMethod: string;
  returnPolicy: string;
  generatedAt: string;
}

export interface InvoiceDataResponse {
  success: boolean;
  invoice: Invoice;
  qrDataUrl?: string;
  // Some backends also return the raw signed token used to build the QR.
  // Used as a fallback when qrDataUrl is unavailable.
  qrToken?: string;
}

// Error thrown when the invoice/PDF is requested before the order is Confirmed.
export class InvoiceNotReadyError extends Error {
  status = 409;
  constructor(message: string) {
    super(message);
    this.name = "InvoiceNotReadyError";
  }
}

const NOT_READY_FALLBACK =
  "Invoice will be available after your order is confirmed.";

// ===================================
// GET INVOICE DATA  (GET /invoice/:orderId/data)
// ===================================

export async function getInvoiceData(
  orderId: string
): Promise<InvoiceDataResponse> {
  try {
    const response = await apiClient.get<InvoiceDataResponse>(
      `/invoice/${orderId}/data`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response?.status === 409) {
      throw new InvoiceNotReadyError(
        axiosError.response.data?.message || NOT_READY_FALLBACK
      );
    }
    throw error;
  }
}

// ===================================
// DOWNLOAD + SHARE INVOICE PDF  (GET /invoice/:orderId)
// ===================================

export async function downloadInvoicePdf(orderId: string): Promise<string> {
  // Resolve auth token (same source the axios interceptor uses).
  const { accessToken } = await loadTokens();
  if (!accessToken) {
    throw new Error("You need to be signed in to download the invoice.");
  }

  const url = `${API_BASE_URL}/invoice/${orderId}`;
  const baseDir =
    FileSystem.documentDirectory || FileSystem.cacheDirectory || "";
  const fileUri = `${baseDir}invoice-${orderId}.pdf`;

  // downloadAsync does NOT throw on non-2xx — it returns the status, so we
  // must inspect it to surface the 409 "not confirmed yet" case.
  const result = await FileSystem.downloadAsync(url, fileUri, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (result.status === 409) {
    let message = NOT_READY_FALLBACK;
    try {
      const body = await FileSystem.readAsStringAsync(result.uri);
      const parsed = JSON.parse(body) as { message?: string };
      if (parsed?.message) message = parsed.message;
    } catch {
      // body wasn't JSON / unreadable — keep fallback message
    }
    // Clean up the bogus (non-PDF) file we just wrote.
    try {
      await FileSystem.deleteAsync(result.uri, { idempotent: true });
    } catch {
      // ignore cleanup failures
    }
    throw new InvoiceNotReadyError(message);
  }

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Failed to download invoice (status ${result.status}).`);
  }

  // Hand off to the OS share sheet (Save to Files, share, print, etc.).
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(result.uri, {
      mimeType: "application/pdf",
      dialogTitle: "Share Invoice",
      UTI: "com.adobe.pdf",
    });
  }

  return result.uri;
}
