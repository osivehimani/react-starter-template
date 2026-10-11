import {useState, useEffect} from 'react';
import './App.css';

const API_URL = 'https://dummyjson.com/products';

function App() {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const [error, setError] = useState('');
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // GET: Fetch initial products from the API
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                setApiError('');

                const response = await fetch(`${API_URL}?limit=10`);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();

                const formattedItems = data.products.map((product) => ({
                    id: product.id,
                    name: product.title,
                    description: product.description,
                }));

                setItems(formattedItems);
            } catch (err) {
                setApiError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setError('');
    };

    // POST: Create a product through the API
    const handleSubmit = async (event) => {
        event.preventDefault();

        const name = formData.name.trim();
        const description = formData.description.trim();

        if (!name) {
            setError('Item name is required');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setApiError('');

            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: name,
                    description: description,
                    price: 0,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            const createdProduct = await response.json();

            const newItem = {
                id: createdProduct.id,
                name: createdProduct.title,
                description: createdProduct.description || '',
            };

            setItems((prevItems) => [newItem, ...prevItems]);

            setFormData({
                name: '',
                description: '',
            });
        } catch (err) {
            setApiError(err.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete from the current UI state
    const handleDelete = (id) => {
        setItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
        );
    };

    return (
        <main className="app-container">
            <header className="app-header">
                <p className="eyebrow">React Starter Template</p>
                <h1>Item Manager</h1>
                <p className="subtitle">
                    A simple place to organize and manage your items.
                </p>
            </header>

            <section className="form-section">
                <h2>Add a new item</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Item name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Item name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Item description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Item description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <button
                        className="primary-button"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Adding...' : '+ Add item'}
                    </button>
                </form>
            </section>

            <section className="items-section">
                <div className="section-heading">
                    <h2>Item List</h2>
                    <span className="item-count">
                        {items.length} items
                    </span>
                </div>

                {apiError && (
                    <p className="error-message" role="alert">
                        {apiError}
                    </p>
                )}

                {loading ? (
                    <div className="empty-state">
                        <p>Loading items...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="empty-state">
                        <h3>No items yet</h3>
                        <p>
                            Add your first item using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="items-list">
                        {items.map((item) => (
                            <article
                                className="item-card"
                                key={item.id}
                            >
                                <div className="item-content">
                                    <h3>{item.name}</h3>
                                    <p>
                                        {item.description ||
                                            'No description provided'}
                                    </p>
                                </div>

                                <button
                                    className="delete-button"
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    aria-label={`Delete ${item.name}`}
                                >
                                    Delete
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default App;