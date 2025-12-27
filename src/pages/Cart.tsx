import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: "1", quantity: 1 },
    { productId: "2", quantity: 1 },
    { productId: "6", quantity: 2 },
  ]);

  const cartProducts = cartItems.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId)!,
  })).filter((item) => item.product);

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.success("Item removed from cart");
  };

  const subtotal = cartProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  if (cartProducts.length === 0) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartProducts.length} item{cartProducts.length !== 1 && "s"} in your cart
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 p-4 rounded-xl bg-card border border-border/50"
              >
                <Link to={`/product/${product.id}`} className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sold by {product.seller.name}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(product.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee (5%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Free (Campus Pickup)</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-6"
                onClick={() => toast.success("Proceeding to checkout...")}
              >
                Proceed to Checkout
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
