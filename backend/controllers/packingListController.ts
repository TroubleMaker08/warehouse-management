import { orders, productMappings } from '../data/sharedData';
import { Request, Response } from 'express';
import { Product, Box, LineItem, Order, ProductMappings } from '../types';

interface PackingListItem {
  orderId: string;
  orderDate: string;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  lineItems: {
    lineItemId: string;
    boxId: string;
    boxName: string;
    boxPrice: number;
    quantity: number;
    subItems: {
      productId: string;
      productName: string;
      productPrice: number;
      quantity: number;
    }[];
  }[];
}

export const getPackingList = (req: Request, res: Response): void => {
  try {
    const { date }: { date?: string } = req.query;

    if (!Array.isArray(orders as Order[]) || !Array.isArray((productMappings as ProductMappings)?.boxes)) {
      console.log('Invalid data format: orders or productMappings.boxes is not an array');
      res.json([]);
      return;
    }

    // Filter orders by date if date parameter is provided
    const filteredOrders: Order[] = date 
      ? (orders as Order[]).filter((order: Order) => {
          const orderDate: Date = new Date(order.order_date);
          const filterDate: Date = new Date(date);
          return orderDate.toDateString() === filterDate.toDateString();
        })
      : orders;

    const packingList: PackingListItem[] = filteredOrders.map((order: Order) => ({
      orderId: order.order_id,
      orderDate: order.order_date,
      shippingAddress: order.shipping_address,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      lineItems: order.line_items?.map((item: LineItem) => {
        const box: Box | undefined = productMappings.boxes.find((box: Box) => box?.box_id === item?.box_id);
        if(!box) {
          return {
            lineItemId: item?.line_item_id,
            boxId: item?.box_id,
            boxName: 'Unknown Box',
            boxPrice: 0,
            quantity: item?.quantity,
            subItems: []
          };
        }
        return {
          lineItemId: item?.line_item_id,
          boxId: item?.box_id,
          boxName: box?.box_name || 'Unknown Box',
          boxPrice: box?.box_price || 0,
          quantity: item?.quantity,
          subItems: box?.box_products?.map((product: Product) => ({
            productId: product?.product_id,
            productName: product?.product_name || 'Unknown Product',
            productPrice: product?.product_price || 0,
            quantity: item?.quantity
          })) || []
        };
      }) || []
    }));

    res.json(packingList);
  } catch (error: unknown) {
    console.error('Error generating packing list:', error);
    res.json([]);
  }
};
