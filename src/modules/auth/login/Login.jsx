import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../../utils/Colors';
import { Button } from 'react-native-elements';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_900Black } from '@expo-google-fonts/roboto';
import Logo from './img/logo-main.png';
import UserService from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, signInWithCustomToken } from '../../../Kernel/config/firebase-config';
import CustomAlert from '../../profile/screens/CustomAlert';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Estados para el CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: '',
    message: '',
    type: 'error',
  });

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_900Black
  });

  useEffect(() => {
    UserService.logout();
  }, []);

  // Función helper para mostrar alertas de error
  const showErrorAlert = (title, message) => {
    setAlertContent({
      title,
      message,
      type: 'error'
    });
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const login = async () => {
    try {
      setLoading(true);
      const response = await UserService.login(email, password);

      if (response.statusCode === 200) {
        if (response.token) {
          setToken(response.token);
          await AsyncStorage.setItem('token', response.token);
          await AsyncStorage.setItem('role', response.role);

          const firebaseTokenData = await UserService.getFirebaseToken(response.token, password);
          if (firebaseTokenData.firebaseToken) {
            await signInWithCustomToken(auth, firebaseTokenData.firebaseToken);
            const loadProfile = await UserService.getYourProfile(response.token);
            if (loadProfile) {
              await AsyncStorage.setItem('profileInfo', JSON.stringify(loadProfile));
              navigation.navigate('TabNavigator');
            }
          }
        }
      } else {
        showErrorAlert('Error', response.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      showErrorAlert(
        'Error',
        error.response?.data?.message || 'Error al iniciar sesión. Por favor intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Validación básica de campos
    if (!email || !password) {
      showErrorAlert('Campos requeridos', 'Por favor ingrese su correo y contraseña');
      return;
    }
    login();
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Image source={Logo} style={{ height: 100, width: 230, borderRadius: 10, marginTop: 20 }} />
      </View>

      <View style={styles.container}>
        <View style={{ width: '100%', alignItems: 'center', marginTop: 5, gap: 20 }}>
          <Text style={styles.text}>Iniciar sesión</Text>

          <View style={{ width: '90%', alignItems: 'center' }}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              placeholderTextColor="black"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={{ width: '90%', alignItems: 'center', marginTop: 10 }}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholderTextColor="black"
              secureTextEntry={true}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={{ marginTop: 30, alignItems: 'center', gap: 15 }}>
            <Button
              title={loading ? "Cargando..." : "Iniciar sesión"}
              titleStyle={{ fontSize: 18, color: 'white' }}
              buttonStyle={{
                backgroundColor: Colors.black,
                width: 220,
                borderRadius: 8,
                paddingVertical: 12,
              }}
              onPress={handleLogin}
              disabled={loading}
            />

            {/* Resto de tus botones... */}
          </View>
        </View>
      </View>

      {/* CustomAlert para errores */}
      <CustomAlert
        visible={alertVisible}
        onClose={handleAlertClose}
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.brown,
    flex: 1,

  },
  text: {
    color: Colors.black,
    fontSize: 24,
    fontWeight: 'semi-bold',

    fontFamily: 'Roboto_900Black',
    textAlign: 'center',
    marginTop: 20,

  },
  container: {
    backgroundColor: Colors.white,
    height: 600,
    borderRadius: 40,
    marginvertical: 20,
    margin: 5,
    justifyContent: 'start',
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 5,
    textAlign: 'left',
    width: '100%',
    fontFamily: 'Roboto_500Medium'
  },
  input: {
    width: '100%',
    backgroundColor: Colors.white,
    borderColor: Colors.brown,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
    color: 'black',
    fontFamily: 'Roboto_400Regular'
  }



})
export default Login
