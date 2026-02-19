import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../api/booksApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, ArrowLeft, Package, BookOpen, Tag } from 'lucide-react';
import './BookDetailPage.css';

export default function BookDetailPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getBookById(id)
            .then(res => setBook(res.data))
            .catch(() => navigate('/'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;
    if (!book) return null;

    const fallbackImage = `https://via.placeholder.com/300x420/7c3aed/ffffff?text=${encodeURIComponent(book.title?.charAt(0) || 'B')}`;

    return (
        <div className="page">
            <div className="container">
                <button className="btn btn-secondary btn-sm back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="book-detail">
                    <div className="book-detail-image-wrap">
                        <img
                            src={book.imageUrl || fallbackImage}
                            alt={book.title}
                            className="book-detail-image"
                            onError={e => { e.target.src = fallbackImage; }}
                        />
                        {book.stockQuantity === 0 && (
                            <div className="out-of-stock-overlay">Out of Stock</div>
                        )}
                    </div>

                    <div className="book-detail-info">
                        {book.genre && <span className="detail-genre">{book.genre}</span>}
                        <h1 className="book-detail-title">{book.title}</h1>
                        <p className="book-detail-author">by {book.author}</p>

                        <div className="book-detail-price">${parseFloat(book.price).toFixed(2)}</div>

                        {book.description && (
                            <div className="book-detail-desc">
                                <h4>Description</h4>
                                <p>{book.description}</p>
                            </div>
                        )}

                        <div className="book-detail-meta">
                            {book.isbn && (
                                <div className="meta-item">
                                    <Tag size={14} />
                                    <span>ISBN: {book.isbn}</span>
                                </div>
                            )}
                            <div className="meta-item">
                                <Package size={14} />
                                <span>
                                    {book.stockQuantity > 0
                                        ? `${book.stockQuantity} in stock`
                                        : 'Out of stock'}
                                </span>
                            </div>
                        </div>

                        {book.stockQuantity > 0 && (
                            <div className="quantity-row">
                                <label className="form-label">Quantity</label>
                                <div className="quantity-control">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(book.stockQuantity, q + 1))}>+</button>
                                </div>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-lg"
                            disabled={book.stockQuantity === 0}
                            onClick={() => {
                                if (!isAuthenticated()) { navigate('/login'); return; }
                                addToCart(book, quantity);
                            }}
                        >
                            <ShoppingCart size={18} />
                            {book.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
