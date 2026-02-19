import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('cart');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (book, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === book.id);
            if (existing) {
                const newQty = existing.quantity + quantity;
                if (newQty > book.stockQuantity) {
                    toast.error('Not enough stock available');
                    return prev;
                }
                toast.success('Cart updated!');
                return prev.map(item =>
                    item.id === book.id ? { ...item, quantity: newQty } : item
                );
            }
            toast.success(`"${book.title}" added to cart!`);
            return [...prev, { ...book, quantity }];
        });
    };

    const removeFromCart = (bookId) => {
        setCartItems(prev => prev.filter(item => item.id !== bookId));
        toast.success('Item removed from cart');
    };

    const updateQuantity = (bookId, quantity) => {
        if (quantity <= 0) { removeFromCart(bookId); return; }
        setCartItems(prev =>
            prev.map(item => item.id === bookId ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
