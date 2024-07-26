import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ListProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      fetchProducts(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <h1>Product List</h1>
      <Link className="button button-primary" to="/add-product">
        Add Product
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Variants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                <img src={product.image} alt={product.name} width="100" />
              </td>
              <td>
                <table>
                  <thead>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Quantity</th>
                  </thead>
                  <tbody>
                    {product.variants.map((variant, index) => (
                      <tr key={index}>
                        <td>{variant.size}</td>
                        <td>{variant.color}</td>
                        <td>{variant.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td>
                <button
                  className="button button-danger"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
                <Link
                  className="button button-primary"
                  to={`/edit-product/${product._id}`}
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListProduct;
