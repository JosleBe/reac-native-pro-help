import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import HomeCampaign from '../screens/HomeCampaign';
import ViewCampaign from '../screens/ViewCampaign';


const Stack = createStackNavigator();
const CampaignStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='HomeCampaign' component={HomeCampaign} />
        <Stack.Screen name='ViewCampaign' component={ViewCampaign} />
    </Stack.Navigator>
  )
}

export default CampaignStack
