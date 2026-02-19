import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import './BookCard.css';

export default function BookCard({ book }) {
    const { addToCart } = useCart();

    const fallbackImage = `https://via.placeholder.com/200x280/7c3aed/ffffff?text=${encodeURIComponent(book.title?.charAt(0) || 'B')}`;

    return (
        <div className="book-card">
            <Link to={`/books/${book.id}`} className="book-card-image-link">
                <div className="book-card-image-wrap">
                    <img
                        src={book.imageUrl || fallbackImage}
                        alt={book.title}
                        className="book-card-image"
                        onError={(e) => { e.target.src = fallbackImage; }}
                    />
                    <div className="book-card-overlay">
                        <span className="book-card-genre">{book.genre || 'General'}</span>
                    </div>
                </div>
            </Link>

            <div className="book-card-body">
                <Link to={`/books/${book.id}`}>
                    <h4 className="book-card-title">{book.title}</h4>
                </Link>
                <p className="book-card-author">{book.author}</p>

                <div className="book-card-footer">
                    <span className="book-card-price">${parseFloat(book.price).toFixed(2)}</span>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(book)}
                        disabled={book.stockQuantity === 0}
                    >
                        <ShoppingCart size={14} />
                        {book.stockQuantity === 0 ? 'Out of Stock' : 'Add'}
                    </button>
                </div>

                {book.stockQuantity <= 5 && book.stockQuantity > 0 && (
                    <p className="book-card-stock-warning">Only {book.stockQuantity} left!</p>
                )}
            </div>
        </div>
    );
}
