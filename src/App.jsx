import {useState} from 'react'
import './App.css'

function App() {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        name: '', description: '',
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((prevData) => ({
            ...prevData, [name]: value,
        }));
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.name.trim()) {
            setError('Item name is required');
        }

        const newItem = {
            id: crypto.randomUUID(), name: formData.name.trim(), description: formData.description.trim(),
        };

        setItems((prevData) => [...prevData, newItem]);
        setFormData({
            name: "", description: "",
        });

        setError("");
    };

    const handleDelete = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }

    return (
        <main className='app-container'>
            <header className='app-header'>
                <p className='eyebrow'>
                    React Starter Template
                </p>
                <h1> Item Manager </h1>
                <p className='subtitle'>
                    A Simple Place to organize and manage your items.
                </p>
            </header>
            <section className='form-section'>
                <h2>Add a new Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='name'>Item name</label>
                        <input
                            id='name'
                            type='text'
                            name='name'
                            placeholder='Item name'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='description'>Item description</label>
                        <textarea
                            id='description'
                            name='description'
                            placeholder='Item description'
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    {error && <p className='error-message'>{error}</p>}
                    <button className="primary-button" type="submit">
                        + Add item
                    </button>
                </form>
            </section>
            <section className='items-section'>
                <div className='section-heading'>
                    <h2>Item List</h2>
                </div>
                <span className='item-count'>{items.length} items</span>
                {items.length === 0 ? (
                    <div className='empty-state'>
                        <h3>No items yet</h3>
                        <p>
                            Add your first item using the form above.
                        </p>
                    </div>
                ) : (
                    <div className='items-list'>
                        {items.map((item) => (
                            <article className='item-card' key={item.id}>
                                <div className='item-content'>
                                    <h3>{item.name}</h3>
                                    <p>{item.description || 'No description provided'}</p>
                                </div>

                                <button className='delete-button' onClick={() => handleDelete(item.id)}
                                        aria-label={`Delete ${item.name}`}>
                                    Delete
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}


export default App
