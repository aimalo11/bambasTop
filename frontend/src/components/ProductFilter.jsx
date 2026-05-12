import { useState } from 'react';
import './ProductFilter.css';

export default function ProductFilter({ onFilterChange }) {
    const [filters, setFilters] = useState({
        name: '',
        minPrice: '',
        maxPrice: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="product-filter">
            <h3>Filtres</h3>
            <div className="filter-group">
                <input
                    type="text"
                    name="name"
                    className="filter-input search-input"
                    placeholder="🔍 Buscar per nom..."
                    value={filters.name}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="minPrice"
                    className="filter-input price-input"
                    placeholder="Min €"
                    value={filters.minPrice}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    className="filter-input price-input"
                    placeholder="Max €"
                    value={filters.maxPrice}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}
