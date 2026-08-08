// InvoiceScreen — native rendering of the order invoice (mirrors the PDF) with a
// "Download / Share PDF" action. Handles the 409 "available after confirmed" case.
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import SafeScreen from "@components/SafeScreen";
import { colors } from "@theme/color";
import {
  getInvoiceData,
  downloadInvoicePdf,
  InvoiceNotReadyError,
} from "@api/invoiceApi";

const formatPrice = (price: number | undefined) => {
  if (price === undefined || price === null) return "₹0";
  return `₹${price.toLocaleString("en-IN")}`;
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function InvoiceScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const orderId: string | undefined =
    route.params?.orderId ||
    route.params?.order?._id ||
    route.params?.order?.orderId;

  const [downloading, setDownloading] = useState(false);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoice", "data", orderId],
    queryFn: () => getInvoiceData(orderId as string),
    enabled: !!orderId,
    retry: (failureCount, err) => {
      // Don't retry the "not confirmed yet" case.
      if (err instanceof InvoiceNotReadyError) return false;
      return failureCount < 2;
    },
  });

  const Header = (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#1F2937" />
      </Pressable>
      <Text style={styles.headerTitle}>Invoice</Text>
      <View style={{ width: 24 }} />
    </View>
  );

  const handleDownload = async () => {
    if (!orderId) return;
    try {
      setDownloading(true);
      await downloadInvoicePdf(orderId);
    } catch (err) {
      if (err instanceof InvoiceNotReadyError) {
        Alert.alert("Invoice not ready", err.message);
      } else {
        Alert.alert(
          "Download failed",
          err instanceof Error
            ? err.message
            : "Could not download the invoice. Please try again."
        );
      }
    } finally {
      setDownloading(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <SafeScreen edges={["top", "bottom"]}>
        {Header}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={styles.loadingText}>Loading invoice...</Text>
        </View>
      </SafeScreen>
    );
  }

  // 409 — invoice not available until confirmed
  if (error instanceof InvoiceNotReadyError) {
    return (
      <SafeScreen edges={["top", "bottom"]}>
        {Header}
        <View style={styles.centerContainer}>
          <Ionicons name="time-outline" size={80} color={colors.tint} />
          <Text style={styles.infoTitle}>Invoice not ready yet</Text>
          <Text style={styles.infoText}>{error.message}</Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  // Generic error
  if (error || !data?.invoice) {
    return (
      <SafeScreen edges={["top", "bottom"]}>
        {Header}
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={80} color={colors.danger} />
          <Text style={styles.errorTitle}>Failed to load invoice</Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  const invoice = data.invoice;
  const shop = invoice.shopDetails;
  const cust = invoice.customerDetails;
  const qrValue = data.qrToken || invoice.invoiceNumber || invoice.orderId;

  return (
    <SafeScreen edges={["top", "bottom"]}>
      {Header}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sheet}>
          {/* Shop header */}
          <View style={styles.shopHeader}>
            {shop?.logoUrl ? (
              <Image
                source={{ uri: shop.logoUrl }}
                style={styles.logo}
                contentFit="contain"
              />
            ) : null}
            <Text style={styles.brand}>{shop?.brandName || "UR Shop"}</Text>
            <Text style={styles.legal}>
              {shop?.legalName || "UK Cosmetics & Gift Center"}
            </Text>
            {!!shop?.address && (
              <Text style={styles.shopMeta}>{shop.address}</Text>
            )}
            <Text style={styles.shopMeta}>
              {[shop?.phone, shop?.email].filter(Boolean).join("  •  ")}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Invoice meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Invoice No.</Text>
              <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
            </View>
            <View style={[styles.metaCol, { alignItems: "flex-end" }]}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>
                {formatDate(invoice.generatedAt)}
              </Text>
            </View>
          </View>
          <View style={styles.orderIdRow}>
            <Text style={styles.metaLabel}>Order ID</Text>
            <Text style={styles.metaValueMono}>#{invoice.orderId}</Text>
          </View>

          <View style={styles.divider} />

          {/* Bill To / Ship To */}
          <View style={styles.partyRow}>
            <View style={styles.partyCol}>
              <Text style={styles.partyHeading}>Bill To</Text>
              <Text style={styles.partyName}>{cust?.name}</Text>
              <Text style={styles.partyText}>{cust?.phone}</Text>
            </View>
            <View style={styles.partyCol}>
              <Text style={styles.partyHeading}>
                Ship To{cust?.label ? ` (${cust.label})` : ""}
              </Text>
              <Text style={styles.partyName}>{cust?.name}</Text>
              <Text style={styles.partyText}>
                {cust?.addressLine1}
                {cust?.addressLine2 ? `, ${cust.addressLine2}` : ""}
              </Text>
              <Text style={styles.partyText}>
                {cust?.city}
                {cust?.pincode ? ` - ${cust.pincode}` : ""}
              </Text>
              <Text style={styles.partyText}>{cust?.phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Items */}
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.itemsHeaderRow}>
            <Text style={[styles.itemsHeaderText, styles.colItem]}>Item</Text>
            <Text style={[styles.itemsHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.itemsHeaderText, styles.colPrice]}>Price</Text>
            <Text style={[styles.itemsHeaderText, styles.colTotal]}>Total</Text>
          </View>
          {invoice.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.colItem}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                {!!item.variantLabel && (
                  <Text style={styles.itemVariant}>{item.variantLabel}</Text>
                )}
              </View>
              <Text style={[styles.itemCell, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.itemCell, styles.colPrice]}>
                {formatPrice(item.unitPrice)}
              </Text>
              <Text style={[styles.itemCell, styles.colTotal, styles.itemTotal]}>
                {formatPrice(item.lineTotal)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Totals */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatPrice(invoice.subtotal)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {formatPrice(invoice.totalAmount)}
            </Text>
          </View>

          {/* Payment */}
          <View style={styles.paymentRow}>
            <Ionicons name="cash-outline" size={18} color={colors.tint} />
            <Text style={styles.paymentText}>
              {invoice.paymentMethod || "Cash on Delivery"}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* QR */}
          <View style={styles.qrWrap}>
            {data.qrDataUrl ? (
              <Image
                source={{ uri: data.qrDataUrl }}
                style={styles.qrImage}
                contentFit="contain"
              />
            ) : (
              <QRCode value={String(qrValue)} size={140} />
            )}
            <Text style={styles.qrCaption}>Scan to verify invoice</Text>
          </View>

          <View style={styles.divider} />

          {/* Return policy footer */}
          {!!invoice.returnPolicy && (
            <View style={styles.policyWrap}>
              <Text style={styles.policyHeading}>Return Policy</Text>
              <Text style={styles.policyText}>{invoice.returnPolicy}</Text>
            </View>
          )}

          <Text style={styles.thankYou}>
            Thank you for shopping with {shop?.brandName || "UR Shop"}!
          </Text>
        </View>
      </ScrollView>

      {/* Download / Share PDF */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.downloadBtn, downloading && styles.downloadBtnDisabled]}
          onPress={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.downloadBtnText}>Download / Share PDF</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 14,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: 8,
  },
  infoTitle: { fontSize: 20, fontWeight: "800", color: "#1F2937" },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  errorTitle: { fontSize: 20, fontWeight: "800", color: colors.danger },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: colors.tint,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  scrollView: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 16, paddingBottom: 110 },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  shopHeader: { alignItems: "center", gap: 2 },
  logo: { width: 64, height: 64, marginBottom: 6 },
  brand: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.tint,
    letterSpacing: 0.5,
  },
  legal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 2,
  },
  shopMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: 16,
  },
  metaRow: { flexDirection: "row", justifyContent: "space-between" },
  metaCol: { flex: 1, gap: 2 },
  metaLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metaValue: { fontSize: 14, fontWeight: "700", color: "#1F2937" },
  metaValueMono: { fontSize: 13, fontWeight: "700", color: "#1F2937" },
  orderIdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  partyRow: { flexDirection: "row", gap: 16 },
  partyCol: { flex: 1, gap: 3 },
  partyHeading: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.tint,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  partyName: { fontSize: 14, fontWeight: "700", color: "#1F2937" },
  partyText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 10,
  },
  itemsHeaderRow: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  itemsHeaderText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  colItem: { flex: 1, paddingRight: 8 },
  colQty: { width: 36, textAlign: "center" },
  colPrice: { width: 70, textAlign: "right" },
  colTotal: { width: 76, textAlign: "right" },
  itemName: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  itemVariant: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemCell: { fontSize: 13, color: "#374151", fontWeight: "500" },
  itemTotal: { fontWeight: "800", color: "#1F2937" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: "600" },
  totalValue: { fontSize: 14, color: "#1F2937", fontWeight: "700" },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  grandTotalLabel: { fontSize: 16, fontWeight: "800", color: "#1F2937" },
  grandTotalValue: { fontSize: 20, fontWeight: "900", color: colors.tint },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    backgroundColor: colors.tintLight,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  paymentText: { fontSize: 14, fontWeight: "700", color: "#1F2937" },
  qrWrap: { alignItems: "center", gap: 8 },
  qrImage: { width: 140, height: 140 },
  qrCaption: { fontSize: 12, color: colors.textSecondary, fontWeight: "500" },
  policyWrap: { gap: 4 },
  policyHeading: { fontSize: 13, fontWeight: "800", color: "#1F2937" },
  policyText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  thankYou: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: colors.tint,
    marginTop: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  downloadBtn: {
    backgroundColor: colors.tint,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  downloadBtnDisabled: { opacity: 0.6 },
  downloadBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
