import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Order, LineItem, Product, PackingListResponse } from '../types/struct.ts';
import { getPreviousDate } from '../utils/dateUtils.ts';
import './PackingList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PackingList = () => {
  const [packingList, setPackingList] = useState([] as PackingListResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const location = useLocation();
  const selectedDate = new URLSearchParams(location.search).get('date') || new Date().toISOString().split('T')[0];
  const previousDate = getPreviousDate(selectedDate);

  useEffect(() => {
    const fetchPackingList = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<PackingListResponse>(`${API_URL}/packing-list?date=${previousDate}`);
        setPackingList(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch packing list');
      } finally {
        setLoading(false);
      }
    };

    fetchPackingList();
  }, [selectedDate, previousDate]);

  if (loading) {
    return <div className="loading">Loading packing list...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="packing-list-container">
      <h2>Packing List for {new Date(selectedDate).toISOString().split('T')[0]}</h2>
      {packingList.length === 0 ? (
        <p>No orders to pack for this date</p>
      ) : (
        packingList.map((order: Order) => (
          <div key={order.orderId} className="order-card">
            <h3>Order #{order.orderId}</h3>
            <div className="order-details">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              <p><strong>Order Date:</strong> {order.orderDate}</p>
            </div>
            <div className="line-items">
              <h4>Items to Pack:</h4>
              {order.lineItems && order.lineItems.length > 0 ? (
                order.lineItems.map((item: LineItem) => (
                  <div key={item.lineItemId} className="line-item">
                    <p><strong>Box Name:</strong> {item.boxName}</p>
                    <p><strong>Box Price:</strong> {item.boxPrice}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <div className="sub-items">
                      <h5>Products in Box:</h5>
                      {item.subItems.map((product: Product) => (
                        <div key={product.productId} className="product-item">
                          <p><strong>Product:</strong> {product.productName}</p>
                          <p><strong>Product Price:</strong> {product.productPrice}</p>
                          <p><strong>Quantity:</strong> {product.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No items in this order</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PackingList; 