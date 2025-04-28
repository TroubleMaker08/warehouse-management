import React, { useEffect, useState, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useLocation } from 'react-router-dom';
import { getPreviousDate } from '../utils/dateUtils.ts';
import { PickListResponse } from '../types/struct.ts';
import './PickList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PickList = () => {
  const [pickList, setPickList] = useState([] as PickListResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const location = useLocation();
  
  const selectedDate = useMemo(() => 
    new URLSearchParams(location.search).get('date') || new Date().toISOString().split('T')[0],
    [location.search]
  );
  
  const previousDate = useMemo(() => 
    getPreviousDate(selectedDate),
    [selectedDate]
  );

  useEffect(() => {
    const fetchPickList = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<PickListResponse>(`${API_URL}/pick-list?date=${previousDate}`);
        setPickList(response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.error || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch pick list');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPickList();
  }, [previousDate]);

  if (loading) {
    return <div className="loading">Loading pick list...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="pick-list-container">
      <h2>Pick List for {selectedDate}</h2>
      {pickList.length === 0 ? (
        <p>No items to pick for this date</p>
      ) : (
        <table className="pick-list-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {pickList.map((item) => (
              <tr key={item.productId}>
                <td>{item.productId}</td>
                <td>{item.productName}</td>
                <td>${item.productPrice.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.productPrice * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PickList;
