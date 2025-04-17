import React, { useState, useEffect } from 'react';

interface Product {
    Id?: number;
    Name: string;
    Category: string;
    Price: number;
    Status?: string;
    Image: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: Product[];
}

const UserProducts: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<Product>({
        Name: '',
        Category: '',
        Price: 0,
        Image: ''
    });
    const [searchParams, setSearchParams] = useState({
        name: '',
        category: ''
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const getAuthToken = (): string => {
        return localStorage.getItem('accessToken') || '';
    };

    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: name === 'Price' ? parseFloat(value) : value
        }));
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                console.log(base64String); // Kiểm tra chuỗi Base64
                setNewProduct(prev => ({
                    ...prev,
                    Image: base64String.split(',')[1], // Loại bỏ tiền tố "data:image/jpeg;base64,"
                }));
            };

            reader.readAsDataURL(file);
        }
    };

    const createProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = getAuthToken();

            if (!token) {
                setError('Authentication token not found. Please log in.');
                setIsLoading(false);
                return;
            }

            const payload = {
                Name: newProduct.Name,
                Category: newProduct.Category,
                Price: newProduct.Price,
                Image: newProduct.Image, // Base64 string
            };

            const response = await fetch('https://localhost:5001/api/v1/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Error: ${response.status} - ${errorText || response.statusText}`);
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            setSuccessMessage('Product created successfully!');
            setNewProduct({
                Name: '',
                Category: '',
                Price: 0,
                Image: '',
            });
            setIsCreateModalOpen(false);
            fetchProducts();
        } catch (err: any) {
            setError(`An error occurred while creating the product: ${err.message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const searchProducts = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = getAuthToken();

            if (!token) {
                setError('Authentication token not found. Please log in.');
                setIsLoading(false);
                return;
            }

            const url = `https://localhost:5001/api/v1/products?category=${encodeURIComponent(searchParams.category)}&name=${encodeURIComponent(searchParams.name)}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                setError('Unauthorized: Your session may have expired. Please log in again.');
                setIsLoading(false);
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Error: ${response.status} - ${errorText || response.statusText}`);
                setIsLoading(false);
                return;
            }

            const data: ApiResponse = await response.json();

            if (data.success) {
                setProducts(data.data);
                setIsSearchModalOpen(false);
            } else {
                setError(data.message || 'Failed to fetch products');
            }
        } catch (err: any) {
            setError(`An error occurred while fetching products: ${err.message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = getAuthToken();

            if (!token) {
                setError('Authentication token not found. Please log in.');
                setIsLoading(false);
                return;
            }

            const response = await fetch('https://localhost:5001/api/v1/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                setError('Unauthorized: Your session may have expired. Please log in again.');
                setIsLoading(false);
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Error: ${response.status} - ${errorText || response.statusText}`);
                setIsLoading(false);
                return;
            }

            const data: ApiResponse = await response.json();

            if (data.success) {
                setProducts(data.data);
            } else {
                setError(data.message || 'Failed to fetch products');
            }
        } catch (err: any) {
            setError(`An error occurred while fetching products: ${err.message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {successMessage && (
                <div
                    style={{
                        color: '#155724',
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '10px',
                        textAlign: 'center',
                    }}
                >
                    {successMessage}
                </div>
            )}
            {error && (
                <div
                    style={{
                        color: '#721c24',
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '10px',
                        textAlign: 'center',
                    }}
                >
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ color: '#B5651D', margin: 0 }}>Products</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create Product
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setIsSearchModalOpen(true)}
                    >
                        Search Products
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#ffc107',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={fetchProducts}
                    >
                        Refresh
                    </button>
                </div>
            </div>
            <div>
                {isLoading ? (
                    <div style={{ textAlign: 'center', color: '#888' }}>Loading...</div>
                ) : products.length > 0 ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.Id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                {product.Image && (
                                    <img
                                        src={`data:image/jpeg;base64,${product.Image}`}
                                        alt={product.Name}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '10px 10px 0 0',
                                            marginBottom: '10px',
                                        }}
                                    />
                                )}
                                <h3 style={{ color: '#333', fontSize: '18px', margin: '10px 0' }}>
                                    {product.Name}
                                </h3>
                                <p style={{ color: '#777', fontSize: '14px', margin: '5px 0' }}>
                                    Category: {product.Category}
                                </p>
                                <p style={{ color: '#007bff', fontSize: '16px', fontWeight: 'bold' }}>
                                    ${product.Price.toFixed(2)}
                                </p>
                                {product.Status && (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            padding: '5px 10px',
                                            backgroundColor:
                                                product.Status === 'Available' ? '#28a745' : '#dc3545',
                                            color: '#fff',
                                            borderRadius: '5px',
                                            fontSize: '12px',
                                            marginTop: '10px',
                                        }}
                                    >
                                        {product.Status}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: '#888' }}>No products found</div>
                )}
            </div>
            {isCreateModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        width: '400px',
                        maxWidth: '90%',
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                        Create New Product
                    </h2>
                    <form onSubmit={createProduct}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Name
                            </label>
                            <input
                                type="text"
                                name="Name"
                                value={newProduct.Name}
                                onChange={handleCreateInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Category
                            </label>
                            <input
                                type="text"
                                name="Category"
                                value={newProduct.Category}
                                onChange={handleCreateInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Price
                            </label>
                            <input
                                type="number"
                                name="Price"
                                value={newProduct.Price}
                                onChange={handleCreateInputChange}
                                step="0.01"
                                min="0"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                            {newProduct.Image && (
                                <img
                                    src={`data:image/jpeg;base64,${newProduct.Image}`}
                                    alt="Preview"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        marginTop: '10px',
                                        borderRadius: '5px',
                                        objectFit: 'cover',
                                    }}
                                />
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                {isLoading ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {isSearchModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        width: '400px',
                        maxWidth: '90%',
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                        Search Products
                    </h2>
                    <form onSubmit={searchProducts}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={searchParams.name}
                                onChange={handleSearchInputChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={searchParams.category}
                                onChange={handleSearchInputChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                type="button"
                                onClick={() => setIsSearchModalOpen(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserProducts;