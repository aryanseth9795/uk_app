// CartToastContext.tsx - Global context for showing cart toast notifications
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import CartToast from "@components/CartToast";

interface CartToastContextType {
  showCartToast: (productName: string) => void;
}

const CartToastContext = createContext<CartToastContextType | undefined>(
  undefined,
);

export function CartToastProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [productName, setProductName] = useState("");

  const showCartToast = useCallback((name: string) => {
    setProductName(name);
    setVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <CartToastContext.Provider value={{ showCartToast }}>
      {children}
      <CartToast
        visible={visible}
        productName={productName}
        onHide={hideToast}
      />
    </CartToastContext.Provider>
  );
}

export function useCartToast() {
  const context = useContext(CartToastContext);
  if (context === undefined) {
    throw new Error("useCartToast must be used within a CartToastProvider");
  }
  return context;
}
