import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['Tous']);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`, { signal: controller.signal }),
          axios.get(`${API_BASE_URL}/categories`, { signal: controller.signal })
        ]);

        setProducts(productsRes.data);

        // Merge DB categories with categories derived from products
        const productCats = productsRes.data.map(p => p.category);
        const dbCats = categoriesRes.data.map(c => c.name);
        const uniqueCats = ['Tous', ...new Set([...dbCats, ...productCats])];
        setCategories(uniqueCats);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup: abort pending requests if component unmounts
    return () => controller.abort();
  }, []);

  return { products, loading, error, categories };
};

