import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MapScreen from './screens/Map'
import PaymentScreen from './screens/Payment'

const Stack = createNativeStackNavigator();

const Router = () => (
    <Stack.Navigator>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
)


export default Router