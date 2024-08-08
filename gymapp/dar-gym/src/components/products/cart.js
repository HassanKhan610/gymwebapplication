
// src/components/Cart.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} from '../../features/cartSlice';
import { useCreateOrderMutation } from '../../services/userAuthApi';
import { useGetLoggedUserQuery } from '../../services/userAuthApi';
import { setUserInfo } from '../../features/userSlice';
import { getToken } from '../../services/LocalStorageService';
import { Table, Space, Button } from 'antd';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = Object.values(useSelector((state) => state.cart));
  const [createOrder] = useCreateOrderMutation();
  const { access_token } = getToken();
  const { data: user, isSuccess } = useGetLoggedUserQuery(access_token);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => <img src={text} alt="" style={{ width: '50px' }} />,
    },
    {
      title: 'Supplement Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Benefits',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleDecrementQuantity(record)}>-</Button>
          <Button onClick={() => handleIncrementQuantity(record)}>+</Button>
          <Button onClick={() => handleRemoveFromCart(record)}>Remove</Button>
        </Space>
      ),
    },
  ];

  const handleCheckout = async () => {
    try {
      const orderItem = cartItems[0];

      if (!user) {
        console.error('User information not available');
        return;
      }

      const userId = Array.isArray(user.id) ? user.id[0] : user.id;
      const orderData = {
        user: userId,
        product: orderItem.id,
        quantity: orderItem.quantity,
        amount: orderItem.price * orderItem.quantity,
      };

      const result = await createOrder(orderData).unwrap();

      console.log('Order created successfully', result);

      dispatch(clearCart());
    } catch (error) {
      console.error('Error creating order', error);
      console.log('Response data:', error.data);
    }
  };

  useEffect(() => {
    if (user && isSuccess) {
      dispatch(setUserInfo({ id: user.id, email: user.email, name: user.name }));
    }
  }, [user, isSuccess, dispatch]);

  const handleIncrementQuantity = (item) => {
    dispatch(incrementQuantity(item.id));
  };

  const handleDecrementQuantity = (item) => {
    dispatch(decrementQuantity(item.id));
  };

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item.id));
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div style={{overflowX:'auto'}}>
      <Table
        dataSource={cartItems}
        columns={columns}
        pagination={false}
        summary={(pageData) => {
          let totalQuantity = 0;
          let totalPrice = 0;

          pageData.forEach(({ quantity, price }) => {
            totalQuantity += quantity;
            totalPrice += quantity * price;
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell colSpan={3} />
                <Table.Summary.Cell>{totalQuantity}</Table.Summary.Cell>
                <Table.Summary.Cell colSpan={2}>${totalPrice.toFixed(2)}</Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={6}>
                  <Button onClick={handleCheckout}>Checkout</Button>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      </div>
    </div>
  );
};

export default Cart;

