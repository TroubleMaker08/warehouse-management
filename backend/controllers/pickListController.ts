import { orders, productMappings } from '../data/sharedData';
import { Request, Response } from 'express';
import { Product, Box, LineItem, Order, PickListItem, ProductMappings } from '../types';

export const getPickList = (req: Request, res: Response): void => {
  try {
    const { date } = req.query;
    
    // Validate that orders and productMappings are arrays
    if (!Array.isArray(orders as Order[]) || !Array.isArray((productMappings as ProductMappings)?.boxes)) {
      console.log('Invalid data format: orders or productMappings.boxes is not an array');
      res.json([]);
      return;
    }

    const pickList: PickListItem[] = [];

    // Filter orders by date if date parameter is provided
    const filteredOrders: Order[] = date 
      ? orders.filter((order: Order) => {
          const orderDate = new Date(order.order_date);
          const filterDate = new Date(date as string);
          return orderDate.toDateString() === filterDate.toDateString();
        })
      : orders;

    filteredOrders.forEach((order: Order) => {
      if (!order?.line_items || !Array.isArray(order.line_items)) return;
      
      order.line_items.forEach((item: LineItem) => {
        if (!item?.box_id) return;

        const box: Box | undefined = productMappings.boxes.find((box: Box) => box?.box_id === item.box_id);
        if (!box) {
          console.warn(`Box with ID ${item.box_id} not found in product mappings`);
          return;
        }

        if (!box?.box_products || !Array.isArray(box.box_products)) {
          console.warn(`Box with ID ${item.box_id} has no products in product mappings`);
          return;
        }

        box.box_products.forEach((product: Product) => {
          if (!product?.product_id) {
            console.warn(`Product with ID ${product.product_id} not found in product mappings`);
            return;
          }

          const existingProduct: PickListItem | undefined = pickList.find(p => p.productId === product.product_id);
          if (existingProduct) {
            existingProduct.quantity += item.quantity;
          } else {
            pickList.push({
              productId: product.product_id,
              productName: product.product_name || 'Unknown Product',
              productPrice: product.product_price || 0,
              quantity: item.quantity
            });
          }
        });
      });
    });

    res.json(pickList);
  } catch (error) {
    console.error('Error generating pick list:', error);
    res.json([]);
  }
};
