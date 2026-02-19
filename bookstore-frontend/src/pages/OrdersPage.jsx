import { useState, useEffect } from 'react';
import { getMyOrders } from '../api/ordersApi';
import { Package, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import './OrdersPage.css';

const STATUS_BADGE = {
    PENDING: 'badge-pending',
    PROCESSING: 'badge-processing',
    SHIPPED: 'badge-shipped',
    DELIVERED: 'badge-delivered',
    CANCELLED: 'badge-cancelled',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setLoading(true);
        getMyOrders({ page, size: 10 })
            .then(res => {
                setOrders(res.data.content);
                setTotalPages(res.data.totalPages);
            })
            .finally(() => setLoading(false));
    }, [page]);

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;

    return (
        <div className="page">
            <div className="container">
                <h2 style={{ marginBottom: 32 }}>My Orders</h2>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <Package size={48} />
                        <h3>No orders yet</h3>
                        <p>Start shopping to see your orders here</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card card">
                                <div className="order-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                                    <div className="order-meta">
                                        <span className="order-id">Order #{order.id}</span>
                                        <span className={`badge ${STATUS_BADGE[order.status] || 'badge-pending'}`}>
                                            {order.status}
                                        </span>
                                        <span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-pending'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="order-right">
                                        <span className="order-total">${order.totalAmount?.toFixed(2)}</span>
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>

                                {expanded === order.id && (
                                    <div className="order-items">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="order-item">
                                                <img
                                                    src={item.bookImageUrl || `https://via.placeholder.com/50x70/7c3aed/fff?text=${item.bookTitle?.charAt(0)}`}
                                                    alt={item.bookTitle}
                                                    className="order-item-img"
                                                    onError={e => { e.target.src = `https://via.placeholder.com/50x70/7c3aed/fff?text=B`; }}
                                                />
                                                <div className="order-item-info">
                                                    <p className="order-item-title">{item.bookTitle}</p>
                                                    <p className="order-item-author">{item.bookAuthor}</p>
                                                </div>
                                                <div className="order-item-price">
                                                    <span>{item.quantity} × ${item.unitPrice?.toFixed(2)}</span>
                                                    <strong>${item.subtotal?.toFixed(2)}</strong>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
                        ))}
                        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>›</button>
                    </div>
                )}
            </div>
        </div>
    );
}
