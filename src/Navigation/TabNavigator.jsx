import React from 'react';
import HomeCampaign from '../modules/homeCampaign/screens/HomeCampaign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import Colors from '../utils/Colors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeCampaign"
      screenOptions={{
        headerShown: false,
     
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          height: 67,
          backgroundColor: Colors.cielo,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={HomeCampaign}
        options={{
          tabBarLabel: 'Perfil',  tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarIcon: ({ size, color }) => (
            <Icon name="person" type="material" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={HomeCampaign}
        options={{
          tabBarLabel: 'Chat',  tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarIcon: ({ size, color }) => (
            <Icon name="chat" type="material" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="HomeCampaign"
        component={HomeCampaign}
        options={{
          tabBarLabel: 'Campañas',  tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarIcon: ({ size, color }) => (
            <View style={styles.homeButton}>
              <Icon name="bullhorn" type="material-community"  color={color} size={30}/>

            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Donations"
        component={HomeCampaign}
        options={{
          tabBarLabel: 'Historial',
          tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarIcon: ({ size, color }) => (
            <Icon name="favorite" type="material" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={HomeCampaign}
        options={{
          tabBarLabel: 'Usuarios',  tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarIcon: ({ size, color }) => (
            <Icon name="group" type="material" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  homeButton: {
    backgroundColor: Colors.brown,
    borderRadius: 35,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -15 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  
});

export default TabNavigator;
