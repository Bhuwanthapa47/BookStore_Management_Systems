import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, BookOpen, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    <BookOpen size={24} />
                    <span>BookStore</span>
                </Link>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Browse Books</Link>
                    {user && !isAdmin() && (
                        <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                    )}
                    {isAdmin() && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)}>
                            <LayoutDashboard size={16} /> Admin
                        </Link>
                    )}
                </div>

                <div className="navbar-actions">
                    {!isAdmin() && (
                        <Link to="/cart" className="cart-btn">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    )}

                    {user ? (
                        <div className="user-menu">
                            <div className="user-avatar">
                                <User size={16} />
                                <span>{user.name?.split(' ')[0]}</span>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}

                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
