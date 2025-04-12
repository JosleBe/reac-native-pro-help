import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Login from '../modules/auth/login/Login'
import CreateAccount from '../modules/auth/CreateAccount'
import HomeCampaign from '../modules/homeCampaign/screens/HomeCampaign'
import TabNavigator from './TabNavigator'


const Stack = createStackNavigator()
const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
    </Stack.Navigator>
  )
}

export default AppNavigator
