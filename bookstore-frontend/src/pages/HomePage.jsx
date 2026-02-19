import { useState, useEffect, useCallback } from 'react';
import { getBooks } from '../api/booksApi';
import BookCard from '../components/BookCard';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import './HomePage.css';

const GENRES = ['All', 'Classic Fiction', 'Dystopian Fiction', 'Fantasy', 'Science Fiction', 'Thriller', 'Non-Fiction', 'Self-Help', 'Fiction', 'Technology', 'Business'];

export default function HomePage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [genre, setGenre] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, size: 12 };
            if (search) params.search = search;
            else if (genre && genre !== 'All') params.genre = genre;
            const res = await getBooks(params);
            setBooks(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, genre]);

    useEffect(() => { fetchBooks(); }, [fetchBooks]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setGenre('');
        setPage(0);
    };

    const handleGenre = (g) => {
        setGenre(g === 'All' ? '' : g);
        setSearch('');
        setSearchInput('');
        setPage(0);
    };

    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="container hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>Discover Your Next Read</span>
                    </div>
                    <h1>
                        Your Premium<br />
                        <span className="gradient-text">Bookstore</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore thousands of books across every genre. From timeless classics to modern bestsellers.
                    </p>
                    <form className="hero-search" onSubmit={handleSearch}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or genre..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>
                </div>
            </section>

            {/* Genre Filter */}
            <section className="genre-section">
                <div className="container">
                    <div className="genre-chips">
                        {GENRES.map(g => (
                            <button
                                key={g}
                                className={`genre-chip ${(g === 'All' && !genre && !search) || genre === g ? 'active' : ''}`}
                                onClick={() => handleGenre(g)}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Books Grid */}
            <section className="books-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2>{search ? `Results for "${search}"` : genre ? genre : 'All Books'}</h2>
                            {!loading && <p className="section-subtitle">{totalElements} books found</p>}
                        </div>
                        {(search || genre) && (
                            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setSearchInput(''); setGenre(''); setPage(0); }}>
                                Clear Filter
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading-center"><div className="spinner" /></div>
                    ) : books.length === 0 ? (
                        <div className="empty-state">
                            <BookOpen size={48} />
                            <h3>No books found</h3>
                            <p>Try a different search term or genre</p>
                        </div>
                    ) : (
                        <div className="books-grid">
                            {books.map(book => <BookCard key={book.id} book={book} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
