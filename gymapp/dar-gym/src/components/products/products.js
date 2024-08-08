

// src/components/Products.js
import React, { useState } from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice';
import { useGetProductsQuery } from '../../services/userAuthApi';
import './products.css';

const Products = () => {
  const dispatch = useDispatch();
  const [displayCount, setDisplayCount] = useState(2); // Initial display count
  const { data: productData, isLoading, isError } = useGetProductsQuery();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const loadMoreProducts = () => {
    // Increase the display count to show more products
    setDisplayCount(displayCount + 2);
  };

  return (
    <div className="products">
      <h1>Product Slider</h1>
      <div className="product-grid">
        {productData &&
          productData.slice(0, displayCount).map((product) => (
            <div key={product.id} className="product-slide">
              
              {/* You can replace the image tag with your actual image component */}
              <img src={product.image} alt={product.title} />
              <div className="product-details">
                <p>Supplement Name: {product.title}</p>
                <p>Benefits: {product.description}</p>
                <p>Price: ${product.price}</p>
                <Button type="primary" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
                <Button type="primary" danger>
                  Buy
                </Button>
              </div>
            </div>
          ))}
      </div>
      {displayCount < productData?.length && (
        <Button type="primary" onClick={loadMoreProducts}>
          Load More
        </Button>
      )}
    </div>
  );
};

export default Products;

