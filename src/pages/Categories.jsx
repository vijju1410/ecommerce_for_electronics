import { useState } from 'react';

function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'smartphones',
    'laptops',
    'tablets',
    'audio',
    'accessories'
  ];

  const products = [
    {
      id: 1,
      name: "iPhone 13 Pro",
      price: 999.99,
      category: "smartphones",
      image: "phone.jpg"
    },
    {
      id: 2,
      name: "MacBook Pro",
      price: 1299.99,
      category: "laptops",
      image: "laptop.jpg"
    },
    // Add more products as needed
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full capitalize ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">₹{product.price}</p>
              <button className="btn-primary w-full">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;