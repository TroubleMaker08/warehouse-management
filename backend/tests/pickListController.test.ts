import { Request, Response } from 'express';
import { getPickList } from '../controllers/pickListController';

describe('PickListController', () => {
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
  });

  it('should generate pick list without date filter', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          line_items: [
            {
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
    
    const { getPickList } = require('../controllers/pickListController');
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([
      {
        productId: 'prod1',
        productName: 'Test Product',
        productPrice: 10,
        quantity: 2
      }
    ]);
  });

  it('should generate pick list with date filter', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          line_items: [
            {
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

    const { getPickList } = require('../controllers/pickListController');
    mockRequest.query = { date: '2024-03-20' };
    
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([
      {
        productId: 'prod1',
        productName: 'Test Product',
        productPrice: 10,
        quantity: 2
      }
    ]);
  });

  it('should return empty array for non-matching date', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          line_items: [
            {
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

    const { getPickList } = require('../controllers/pickListController');
    mockRequest.query = { date: '2024-03-21' };
    
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should handle invalid orders data', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: null,
      productMappings: { boxes: [] }
    }));
    
    const { getPickList } = require('../controllers/pickListController');
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should handle missing box in product mappings', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [{
        order_id: '1',
        order_date: '2024-03-20',
        line_items: [{ box_id: 'nonexistent', quantity: 1 }]
      }],
      productMappings: { boxes: [] }
    }));
    
    const { getPickList } = require('../controllers/pickListController');
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should handle missing product data', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [{
        order_id: '1',
        order_date: '2024-03-20',
        line_items: [{ box_id: 'box1', quantity: 1 }]
      }],
      productMappings: {
        boxes: [{
          box_id: 'box1',
          box_products: [{ product_id: null }]
        }]
      }
    }));
    
    const { getPickList } = require('../controllers/pickListController');
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should aggregate quantities for same product', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          line_items: [{ box_id: 'box1', quantity: 2 }]
        },
        {
          order_id: '2',
          order_date: '2024-03-20',
          line_items: [{ box_id: 'box1', quantity: 3 }]
        }
      ],
      productMappings: {
        boxes: [{
          box_id: 'box1',
          box_products: [{
            product_id: 'prod1',
            product_name: 'Test Product',
            product_price: 10
          }]
        }]
      }
    }));
    
    const { getPickList } = require('../controllers/pickListController');
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([
      {
        productId: 'prod1',
        productName: 'Test Product',
        productPrice: 10,
        quantity: 5
      }
    ]);
  });

  it('should handle missing line items', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          line_items: undefined
        }
      ],
      productMappings: {
        boxes: [
          {
            box_id: 'box1',
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
    
    const { getPickList } = require('../controllers/pickListController');
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should handle error and return empty array', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: 'invalid-date', // This will cause a Date parsing error
          line_items: [
            {
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
    
    const { getPickList } = require('../controllers/pickListController');
    mockRequest.query = { date: '2024-03-20' }; // This will trigger date comparison with invalid date
    
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it('should handle missing box_products array', () => {
    jest.doMock('../data/sharedData', () => ({
      orders: [
        {
          order_id: '1',
          order_date: '2024-03-20',
          line_items: [
            {
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
            box_products: undefined
          }
        ]
      }
    }));
    
    const { getPickList } = require('../controllers/pickListController');
    getPickList(mockRequest as Request, mockResponse as Response);
    
    expect(jsonMock).toHaveBeenCalledWith([]);
  });
});
