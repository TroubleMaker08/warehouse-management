import { Request, Response } from 'express';
import { getPackingList } from '../controllers/packingListController';

describe('PackingListController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    
    jsonMock = jest.fn();
    mockRequest = {
      query: {}
    };
    mockResponse = {
      json: jsonMock
    };
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should generate packing list without date filter', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          shipping_address: '123 Test St',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          line_items: [
            {
              line_item_id: 'li1',
              box_id: 'box1',
              quantity: 2
            }
          ]
        }
      ],
      productMappings: {
        boxes: [
          {
            box_id: 'box1',
            box_name: 'Test Box',
            box_price: 20,
            box_products: [
              {
                product_id: 'prod1',
                product_name: 'Test Product',
                product_price: 10
              }
            ]
          }
        ]
      }
    }));

    const { getPackingList } = require('../controllers/packingListController');
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([
      {
        orderId: '1',
        orderDate: '2024-03-20',
        shippingAddress: '123 Test St',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        lineItems: [
          {
            lineItemId: 'li1',
            boxId: 'box1',
            boxName: 'Test Box',
            boxPrice: 20,
            quantity: 2,
            subItems: [
              {
                productId: 'prod1',
                productName: 'Test Product',
                productPrice: 10,
                quantity: 2
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should generate packing list with date filter', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          shipping_address: '123 Test St',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          line_items: [
            {
              line_item_id: 'li1',
              box_id: 'box1',
              quantity: 2
            }
          ]
        }
      ],
      productMappings: {
        boxes: [
          {
            box_id: 'box1',
            box_name: 'Test Box',
            box_price: 20,
            box_products: [
              {
                product_id: 'prod1',
                product_name: 'Test Product',
                product_price: 10
              }
            ]
          }
        ]
      }
    }));

    const { getPackingList } = require('../controllers/packingListController');
    mockRequest.query = { date: '2024-03-20' };
    
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([
      {
        orderId: '1',
        orderDate: '2024-03-20',
        shippingAddress: '123 Test St',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        lineItems: [
          {
            lineItemId: 'li1',
            boxId: 'box1',
            boxName: 'Test Box',
            boxPrice: 20,
            quantity: 2,
            subItems: [
              {
                productId: 'prod1',
                productName: 'Test Product',
                productPrice: 10,
                quantity: 2
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should return empty array for non-matching date', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          shipping_address: '123 Test St',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          line_items: [
            {
              line_item_id: 'li1',
              box_id: 'box1',
              quantity: 2
            }
          ]
        }
      ],
      productMappings: {
        boxes: [
          {
            box_id: 'box1',
            box_name: 'Test Box',
            box_price: 20,
            box_products: [
              {
                product_id: 'prod1',
                product_name: 'Test Product',
                product_price: 10
              }
            ]
          }
        ]
      }
    }));

    const { getPackingList } = require('../controllers/packingListController');
    mockRequest.query = { date: '2024-03-21' };
    
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should handle invalid orders data', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: null,
      productMappings: { boxes: [] }
    }));
    
    const { getPackingList } = require('../controllers/packingListController');
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should handle missing box in product mappings', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [{
        order_id: '1',
        order_date: '2024-03-20',
        shipping_address: '123 Test St',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        line_items: [
          {
            line_item_id: 'li1',
            box_id: 'nonexistent',
            quantity: 1
          }
        ]
      }],
      productMappings: { boxes: [] }
    }));
    
    const { getPackingList } = require('../controllers/packingListController');
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([
      {
        orderId: '1',
        orderDate: '2024-03-20',
        shippingAddress: '123 Test St',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        lineItems: [
          {
            lineItemId: 'li1',
            boxId: 'nonexistent',
            boxName: 'Unknown Box',
            boxPrice: 0,
            quantity: 1,
            subItems: []
          }
        ]
      }
    ]);
  });

  it('should handle missing product data', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [{
        order_id: '1',
        order_date: '2024-03-20',
        shipping_address: '123 Test St',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        line_items: [
          {
            line_item_id: 'li1',
            box_id: 'box1',
            quantity: 1
          }
        ]
      }],
      productMappings: {
        boxes: [{
          box_id: 'box1',
          box_name: 'Test Box',
          box_price: 20,
          box_products: [{ product_id: null }]
        }]
      }
    }));
    
    const { getPackingList } = require('../controllers/packingListController');
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([
      {
        orderId: '1',
        orderDate: '2024-03-20',
        shippingAddress: '123 Test St',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        lineItems: [
          {
            lineItemId: 'li1',
            boxId: 'box1',
            boxName: 'Test Box',
            boxPrice: 20,
            quantity: 1,
            subItems: [
              {
                productId: null,
                productName: 'Unknown Product',
                productPrice: 0,
                quantity: 1
              }
            ]
          }
        ]
      }
    ]);
  });

  it('should handle error and return empty array', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: 'invalid-date', // This will cause a Date parsing error
          shipping_address: '123 Test St',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          line_items: [
            {
              line_item_id: 'li1',
              box_id: 'box1',
              quantity: 2
            }
          ]
        }
      ],
      productMappings: {
        boxes: [
          {
            box_id: 'box1',
            box_name: 'Test Box',
            box_price: 20,
            box_products: [
              {
                product_id: 'prod1',
                product_name: 'Test Product',
                product_price: 10
              }
            ]
          }
        ]
      }
    }));
    
    const { getPackingList } = require('../controllers/packingListController');
    mockRequest.query = { date: '2024-03-20' }; // This will trigger date comparison with invalid date
    
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should handle missing line items', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          shipping_address: '123 Test St',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          line_items: undefined
        }
      ],
      productMappings: {
        boxes: [
          {
            box_id: 'box1',
            box_name: 'Test Box',
            box_price: 20,
            box_products: [
              {
                product_id: 'prod1',
                product_name: 'Test Product',
                product_price: 10
              }
            ]
          }
        ]
      }
    }));
    
    const { getPackingList } = require('../controllers/packingListController');
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([
      {
        orderId: '1',
        orderDate: '2024-03-20',
        shippingAddress: '123 Test St',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        lineItems: []
      }
    ]);
  });

  it('should handle error when accessing orders throws an error', () => {
    jest.doMock('../data/sharedData', () => ({
      get orders() {
        throw new Error('Test error');
      },
      productMappings: { boxes: [] }
    }));
    
    const { getPackingList } = require('../controllers/packingListController');
    getPackingList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
    expect(console.error).toHaveBeenCalledWith('Error generating packing list:', expect.any(Error));
  });
});
