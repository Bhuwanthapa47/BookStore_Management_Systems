import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, createBook, updateBook, deleteBook } from '../api/booksApi';
import { getAllOrders, updateOrderStatus } from '../api/ordersApi';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, BookOpen, Package, Users, TrendingUp, ChevronDown } from 'lucide-react';
import './AdminDashboard.css';

const EMPTY_BOOK = { title: '', author: '', genre: '', isbn: '', price: '', description: '', stockQuantity: '', imageUrl: '' };
const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_BADGE = { PENDING: 'badge-pending', PROCESSING: 'badge-processing', SHIPPED: 'badge-shipped', DELIVERED: 'badge-delivered', CANCELLED: 'badge-cancelled' };

export default function AdminDashboard() {
    const [tab, setTab] = useState('overview');
    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [booksPage, setBooksPage] = useState(0);
    const [booksTotalPages, setBooksTotalPages] = useState(0);
    const [ordersPage, setOrdersPage] = useState(0);
    const [ordersTotalPages, setOrdersTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [bookForm, setBookForm] = useState(EMPTY_BOOK);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (tab === 'books' || tab === 'overview') fetchBooks();
    }, [tab, booksPage]);

    useEffect(() => {
        if (tab === 'orders' || tab === 'overview') fetchOrders();
    }, [tab, ordersPage]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await getBooks({ page: booksPage, size: 10 });
            setBooks(res.data.content);
            setBooksTotalPages(res.data.totalPages);
        } finally { setLoading(false); }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getAllOrders({ page: ordersPage, size: 10 });
            setOrders(res.data.content);
            setOrdersTotalPages(res.data.totalPages);
        } finally { setLoading(false); }
    };

    const openAddModal = () => { setEditBook(null); setBookForm(EMPTY_BOOK); setShowModal(true); };
    const openEditModal = (book) => {
        setEditBook(book);
        setBookForm({ title: book.title, author: book.author, genre: book.genre || '', isbn: book.isbn || '', price: book.price, description: book.description || '', stockQuantity: book.stockQuantity, imageUrl: book.imageUrl || '' });
        setShowModal(true);
    };

    const handleSaveBook = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...bookForm, price: parseFloat(bookForm.price), stockQuantity: parseInt(bookForm.stockQuantity) };
            if (editBook) { await updateBook(editBook.id, payload); toast.success('Book updated!'); }
            else { await createBook(payload); toast.success('Book added!'); }
            setShowModal(false);
            fetchBooks();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to save book'); }
        finally { setSaving(false); }
    };

    const handleDeleteBook = async (id, title) => {
        if (!confirm(`Delete "${title}"?`)) return;
        try { await deleteBook(id); toast.success('Book deleted'); fetchBooks(); }
        catch (err) { toast.error('Failed to delete book'); }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try { await updateOrderStatus(orderId, { status }); toast.success('Status updated'); fetchOrders(); }
        catch (err) { toast.error('Failed to update status'); }
    };

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <div className="page">
            <div className="container">
                <div className="admin-header">
                    <h2>Admin Dashboard</h2>
                    <div className="admin-tabs">
                        {['overview', 'books', 'orders'].map(t => (
                            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview */}
                {tab === 'overview' && (
                    <div className="overview-grid">
                        <div className="stat-card card">
                            <div className="stat-icon"><BookOpen size={24} /></div>
                            <div><p className="stat-label">Total Books</p><h3 className="stat-value">{books.length}</h3></div>
                        </div>
                        <div className="stat-card card">
                            <div className="stat-icon orders"><Package size={24} /></div>
                            <div><p className="stat-label">Total Orders</p><h3 className="stat-value">{orders.length}</h3></div>
                        </div>
                        <div className="stat-card card">
                            <div className="stat-icon revenue"><TrendingUp size={24} /></div>
                            <div><p className="stat-label">Revenue</p><h3 className="stat-value">${totalRevenue.toFixed(2)}</h3></div>
                        </div>
                        <div className="stat-card card">
                            <div className="stat-icon pending"><Package size={24} /></div>
                            <div><p className="stat-label">Pending Orders</p><h3 className="stat-value">{orders.filter(o => o.status === 'PENDING').length}</h3></div>
                        </div>
                    </div>
                )}

                {/* Books Tab */}
                {tab === 'books' && (
                    <div>
                        <div className="tab-actions">
                            <h3>Book Inventory</h3>
                            <button className="btn btn-primary" onClick={openAddModal}><Plus size={16} /> Add Book</button>
                        </div>
                        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr><th>Cover</th><th>Title</th><th>Author</th><th>Genre</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {books.map(book => (
                                            <tr key={book.id}>
                                                <td>
                                                    <img src={book.imageUrl || `https://via.placeholder.com/40x56/7c3aed/fff?text=${book.title?.charAt(0)}`}
                                                        alt={book.title} className="table-book-img"
                                                        onError={e => { e.target.src = `https://via.placeholder.com/40x56/7c3aed/fff?text=B`; }} />
                                                </td>
                                                <td className="table-title">{book.title}</td>
                                                <td className="text-muted">{book.author}</td>
                                                <td><span className="badge badge-shipped">{book.genre || '—'}</span></td>
                                                <td className="text-accent">${parseFloat(book.price).toFixed(2)}</td>
                                                <td className={book.stockQuantity <= 5 ? 'text-warning' : ''}>{book.stockQuantity}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(book)}><Edit2 size={14} /></button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBook(book.id, book.title)}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {tab === 'orders' && (
                    <div>
                        <h3 style={{ marginBottom: 20 }}>All Orders</h3>
                        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th><th>Update Status</th></tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>
                                                    <div>
                                                        <p style={{ fontWeight: 500 }}>{order.userName}</p>
                                                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>{order.userEmail}</p>
                                                    </div>
                                                </td>
                                                <td className="text-accent">${order.totalAmount?.toFixed(2)}</td>
                                                <td><span className={`badge ${STATUS_BADGE[order.status] || 'badge-pending'}`}>{order.status}</span></td>
                                                <td><span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-pending'}`}>{order.paymentStatus}</span></td>
                                                <td className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <select
                                                        className="form-select status-select"
                                                        value={order.status}
                                                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
                                                    >
                                                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Book Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editBook ? 'Edit Book' : 'Add New Book'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveBook} className="book-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input className="form-input" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Author *</label>
                                    <input className="form-input" value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Genre</label>
                                    <input className="form-input" value={bookForm.genre} onChange={e => setBookForm({ ...bookForm, genre: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ISBN</label>
                                    <input className="form-input" value={bookForm.isbn} onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Price *</label>
                                    <input className="form-input" type="number" step="0.01" min="0" value={bookForm.price} onChange={e => setBookForm({ ...bookForm, price: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stock *</label>
                                    <input className="form-input" type="number" min="0" value={bookForm.stockQuantity} onChange={e => setBookForm({ ...bookForm, stockQuantity: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input className="form-input" value={bookForm.imageUrl} onChange={e => setBookForm({ ...bookForm, imageUrl: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input form-textarea" value={bookForm.description} onChange={e => setBookForm({ ...bookForm, description: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                                    {saving ? 'Saving...' : editBook ? 'Update Book' : 'Add Book'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
