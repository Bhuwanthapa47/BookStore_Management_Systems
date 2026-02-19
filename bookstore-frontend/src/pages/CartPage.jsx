import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api/ordersApi';
import toast from 'react-hot-toast';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, BookOpen } from 'lucide-react';
import './CartPage.css';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated()) { navigate('/login'); return; }
        setLoading(true);
        try {
            const items = cartItems.map(item => ({ bookId: item.id, quantity: item.quantity }));
            await placeOrder({ items });
            clearCart();
            toast.success('Order placed successfully! 🎉');
            navigate('/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <ShoppingCart size={64} />
                        <h3>Your cart is empty</h3>
                        <p>Browse our collection and add some books!</p>
                        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
                            <BookOpen size={16} /> Browse Books
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <h2 style={{ marginBottom: 32 }}>Shopping Cart</h2>
                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item card">
                                <img
                                    src={item.imageUrl || `https://via.placeholder.com/80x110/7c3aed/fff?text=${item.title?.charAt(0)}`}
                                    alt={item.title}
                                    className="cart-item-image"
                                    onError={e => { e.target.src = `https://via.placeholder.com/80x110/7c3aed/fff?text=${item.title?.charAt(0)}`; }}
                                />
                                <div className="cart-item-info">
                                    <Link to={`/books/${item.id}`} className="cart-item-title">{item.title}</Link>
                                    <p className="cart-item-author">{item.author}</p>
                                    <p className="cart-item-price">${parseFloat(item.price).toFixed(2)} each</p>
                                </div>
                                <div className="cart-item-controls">
                                    <div className="quantity-control">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                    </div>
                                    <p className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary card">
                        <h3>Order Summary</h3>
                        <div className="divider" />
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-line">
                                <span>{item.title} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="divider" />
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-full btn-lg"
                            onClick={handleCheckout}
                            disabled={loading}
                            style={{ marginTop: 16 }}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                        <button className="btn btn-secondary btn-full btn-sm" onClick={clearCart} style={{ marginTop: 8 }}>
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
