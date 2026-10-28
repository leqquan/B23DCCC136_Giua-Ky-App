// AppNavigator - Điều hướng ứng dụng
// Stack Navigation cho Menu và Table flows

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors, Typography} from '../theme';

import MenuScreen from '../screens/MenuScreen';
import DishFormScreen from '../screens/DishFormScreen';
import TableMapScreen from '../screens/TableMapScreen';
import OrderScreen from '../screens/OrderScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createNativeStackNavigator();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: Colors.textOnPrimary,
  headerTitleStyle: {
    ...Typography.h3,
    color: Colors.textOnPrimary,
  },
  headerTitleAlign: 'center',
  headerShadowVisible: false,
  animation: 'slide_from_right',
  contentStyle: {
    backgroundColor: Colors.background,
  },
};

// Stack cho tab Thực đơn
export const MenuStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="MenuMain"
        component={MenuScreen}
        options={{title: '🍽️ Thực Đơn'}}
      />
      <Stack.Screen
        name="DishForm"
        component={DishFormScreen}
        options={{title: 'Thêm món'}}
      />
    </Stack.Navigator>
  );
};

// Stack cho tab Sơ đồ bàn
export const TableStack = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="TableMapMain"
        component={TableMapScreen}
        options={{title: '🪑 Sơ Đồ Bàn'}}
      />
      <Stack.Screen
        name="Order"
        component={OrderScreen}
        options={{title: 'Gọi món'}}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{title: 'Thanh toán'}}
      />
    </Stack.Navigator>
  );
};
