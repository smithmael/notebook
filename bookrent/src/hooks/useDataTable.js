import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * A reusable hook for managing data table state including fetching, searching, and filtering.
 * @param {string} endpoint - The API endpoint to fetch data from (e.g., '/owners').
 */
export const useDataTable = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  // You can add more filters here later if needed
  // const [filters, setFilters] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchText,
        // ...filters,
      };
      
      const response = await axios.get(`${API_URL}${endpoint}`, { params });
      setData(response.data);
    } catch (error) {
      console.error(`Failed to fetch data from ${endpoint}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, searchText/*, filters*/]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchData]);

  return {
    data,
    loading,
    searchText,
    setSearchText,
    refreshData: fetchData,
  };
};