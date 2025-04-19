import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import Colors from '../utils/Colors';

import CampaignStack from '../modules/homeCampaign/navigation/stack/CampaignStack';
import HomeCampaign from '../modules/homeCampaign/screens/HomeCampaign';
import Chat from '../modules/chatinbox/screen/Chat';
import Donations from '../modules/donations/screens/Donations';
import Login from '../modules/auth/login/Login';
import UserService from '../modules/auth/service/AuthService';
import Users from '../modules/users/screens/Users';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await UserService.isAuthenticated();
      setIsAuthenticated(auth);
    };
    const checkAdmin = async () => {
      const admin = await UserService.isAdmin();
      setIsAdmin(admin);
    };
    checkAuth();
    checkAdmin();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.brown} />
      </View>
    );
  }

  // Creamos todos los tabs excepto campañas
  const otherTabs = [];



  if (isAuthenticated) {
    otherTabs.push({
      key: 'Profile',
      name: 'Profile',
      component: HomeCampaign,
      label: 'Perfil',
      icon: <Icon name="person" type="material" size={30} />,
    });

    otherTabs.push({
      key: 'Chat',
      name: 'Chat',
      component: Chat,
      label: 'Chat',
      icon: <Icon name="chat" type="material" size={30} />,
    });

    if (isAdmin) {
      otherTabs.push({
        key: 'Donations',
        name: 'Donations',
        component: Donations,
        label: 'Donaciones',
        icon: <Icon name="favorite" type="material" size={32} />,
      });

      otherTabs.push({
        key: 'Users',
        name: 'Users',
        component: Users,
        label: 'Usuarios',
        icon: <Icon name="group" type="material" size={30} />,
      });
    }
  }

  // Dividimos en dos partes para insertar campañas al centro
  const halfIndex = Math.ceil(otherTabs.length / 2);
  const leftTabs = otherTabs.slice(0, halfIndex);
  const rightTabs = otherTabs.slice(halfIndex);

  return (
    <Tab.Navigator
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
      {/* Tabs izquierda */}
      {leftTabs.map((tab) => (
        <Tab.Screen
          key={tab.key}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarLabelStyle: { fontSize: 9, fontWeight: 'bold' },
            tabBarIcon: ({ color }) =>
              React.cloneElement(tab.icon, { color }),
          }}
        />
      ))}

      {/* Campañas siempre al centro */}
      <Tab.Screen
        name="HomeCampaign"
        component={CampaignStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('HomeCampaign', { screen: 'HomeCampaign' });
          },
        })}
        options={{
          tabBarLabel: 'Campañas',
          tabBarLabelStyle: { fontSize: 9, fontWeight: 'bold' },
          tabBarIcon: ({ color }) => (
            <View style={styles.homeButton}>
              <Icon name="bullhorn" type="material-community" color={color} size={30} />
            </View>
          ),
        }}
      />

      {/* Tabs derecha */}
      {rightTabs.map((tab) => (
        <Tab.Screen
          key={tab.key}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarLabelStyle: { fontSize: 9, fontWeight: 'bold' },
            tabBarIcon: ({ color }) =>
              React.cloneElement(tab.icon, { color }),
          }}
        />
      ))}
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
