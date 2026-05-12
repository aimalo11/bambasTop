import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const DEFAULT_PRODUCTS = [
        { _id: '1', name: 'Nike React Vision Black/Blue', price: 160, category: 'Running', image: 'nike-react-vision.jpg', description: 'Designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.', sku: 'NKE-REA', stock: 50 },
        { _id: '2', name: 'Nike Air Max Plus TN Gradient Blue', price: 180, category: 'Casual', image: 'nike-tn.jpg', description: 'The Nike Air Max Plus TN offers a Tuned Air experience that offers premium stability and unbelievable cushioning.', sku: 'NKE-TNP', stock: 30 },
        { _id: '3', name: 'Nike Air Force 1 Custom Drip', price: 120, category: 'Casual', image: 'custom-af1.jpg', description: 'The radiance lives on in the Nike Air Force 1 \'07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash to make you shine.', sku: 'NKE-AF1', stock: 100 }
    ];

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data) {
                    setProduct(data.data);
                } else {
                    handleLocalFallback();
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                handleLocalFallback();
                setLoading(false);
            });

        function handleLocalFallback() {
            const localProduct = DEFAULT_PRODUCTS.find(p => p._id === id);
            if (localProduct) setProduct(localProduct);
        }
    }, [id]);

    const addToCart = () => {
        if (!product) return;

        const cartItem = {
            productoId: product._id,
            nombre: product.name,
            precio: Number(product.price)
        };

        fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItem)
        })
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(() => {
                alert("Producte afegit a la cistella! 🛒");
            })
            .catch(err => {
                console.error("Backend failed, using localStorage:", err);
                const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
                localCart.push({ ...cartItem, _id: Date.now().toString() });
                localStorage.setItem('cart', JSON.stringify(localCart));
                alert("Producte afegit a la cistella (mode local)! 🛒");
            });
    };

    if (loading) return <div className="product-detail-container">Carregant...</div>;
    if (!product) return <div className="product-detail-container">Producte no trobat</div>;

    return (
        <div className="product-detail-container">
            <div className="detail-image-section">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <span className="back-arrow">←</span> Tornar
                </button>
                <div className="detail-image-placeholder">
                    {product.image ? (
                        <img src={product.image.startsWith('http') ? product.image : `/images/${product.image}`} alt={product.name} style={{ mixBlendMode: 'screen', width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        '👟'
                    )}
                </div>
            </div>

            <div className="detail-info">
                <h1 className="detail-title">{product.name}</h1>
                <div className="detail-meta">
                    <span className="chip category-chip">{product.category || 'General'}</span>
                    <span className="chip sku-chip">SKU: {product.sku || 'N/A'}</span>
                    <span className="chip stock-chip">Estoc: {product.stock}</span>
                </div>

                <p className="detail-price">{product.price}€</p>

                <div className="detail-description">
                    <p>{product.description || "Sense descripció disponible per aquest producte."}</p>
                </div>

                <div className="detail-actions">
                    <button
                        onClick={addToCart}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '15px' }}
                    >
                        Afegir a la cistella
                    </button>
                </div>
            </div>
        </div>
    );
}

