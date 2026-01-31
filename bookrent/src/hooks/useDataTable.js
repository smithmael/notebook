import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useDataTable = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); // Get Token

    try {
      const params = { search: searchText };
      
      const response = await axios.get(`${API_URL}${endpoint}`, { 
        params,
        headers: { Authorization: `Bearer ${token}` } // Send Token
      });
      
      // FIX: Handle Prisma 5 Pagination Response
      // If server returns { data: [...], total: 10 }, we want the array in 'data'
      if (response.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else if (Array.isArray(response.data)) {
        // If server returns just [...] (like Owners list)
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(`Failed to fetch data from ${endpoint}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, searchText]);

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