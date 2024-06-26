import { Route, Routes } from "react-router-dom";
import { useState, createContext } from "react";
import { Home } from "../pages/Home";
import { Product } from "../pages/Product";
import { Cart } from "../pages/Cart";
import { Pay } from "../pages/Pay";
import { TypeProductInCart, TypeBody } from "../components/types/Types";

export const HandlePurchaseChangeContext = createContext<
  (purchase: TypeProductInCart) => void
>(undefined!);

const Body: React.FC<TypeBody> = ({ loginState, itemInSearch }) => {
  const [productsInCart, setProductsInCart] = useState<TypeProductInCart[]>([]);
  const [cart, setCart] = useState<{
    num: number;
    price: number;
  }>({ num: 0, price: 0 });

  // This method is called when a new item is added to cart
  const handlePurchaseChange = (purchase: TypeProductInCart) => {
    let newPurchaseflag = true;
    productsInCart.map((p) => {
      // If the same item is already in cart, add the number of products
      // If not, add the new item as a new item in the list
      if (p.product.productId === purchase.product.productId) {
        p.purchaseAmmount += purchase.purchaseAmmount;
        newPurchaseflag = false;
      }
    });
    if (newPurchaseflag) {
      setProductsInCart((prevPurchase) => [...prevPurchase, purchase]);
    }
    // Update cart infomation
    if (purchase.product.price === "load") throw new Error("Not number");
    setCart({
      num: cart.num + purchase.purchaseAmmount,
      price: cart.price + purchase.purchaseAmmount * purchase.product.price,
    });
  };

  // Delete product in cart (one kind at a time)
  const handlePurchaseDelete = (deleteIndex: number) => {
    let deleteItemNum: number = productsInCart[deleteIndex].purchaseAmmount;
    let deleteItemPrice: number;
    const deletedArr = productsInCart.filter((key, index) => {
      if (index === deleteIndex) {
        deleteItemNum = key.purchaseAmmount;
        if (key.product.price === "load") throw new Error("Not number");
        deleteItemPrice = key.product.price * key.purchaseAmmount;
        setCart({
          num: cart.num - deleteItemNum,
          price: cart.price - deleteItemPrice,
        });
      } else {
        return key;
      }
    });

    setProductsInCart(deletedArr);
  };

  return (
    <div style={{ fontSize: "15px" }}>
      <HandlePurchaseChangeContext.Provider value={handlePurchaseChange}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/product"
            element={<Product itemInSearch={itemInSearch} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                setProductsInCart={setProductsInCart}
                loginState={loginState}
                purchases={productsInCart}
                purchaseSum={cart}
                onPurchaseDelete={handlePurchaseDelete}
              />
            }
          />
          <Route path="/pay" element={<Pay />} />
        </Routes>
      </HandlePurchaseChangeContext.Provider>
    </div>
  );
};

export default Body;
