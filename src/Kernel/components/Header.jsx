import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Roboto_400Regular, Roboto_500Medium, Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import Colors from '../../utils/Colors';
import UserService from '../../modules/auth/service/AuthService';

const Header = ({ name }) => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_900Black
  });

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await UserService.isAuthenticated();
      setIsAuthenticated(auth);
    };
    checkAuth();
  }, []);

  if (!fontsLoaded || isAuthenticated === null) {
    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={Colors.brown} />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        {!isAuthenticated && (
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Iniciar sesión</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    padding: 5,
    width: '100%',
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cielo,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Roboto_900Black',
    textAlign: 'center',
  },
  loginText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto_500Medium',
  },
});

export default Header;
