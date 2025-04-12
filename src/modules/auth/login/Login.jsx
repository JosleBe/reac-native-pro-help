import React, { useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import Colors from '../../../utils/Colors'
import { Button, Input, } from 'react-native-elements'
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_900Black } from '@expo-google-fonts/roboto';
import Logo from './img/logo-main.png'
import UserService from '../service/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);


  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_900Black
  });

  const login = async () => {
    navigation.navigate('TabNavigator');
    
      /*
  try {

    const response = await UserService.login(email, password);
   //  console.log('Response:', response) 
  
  
   Response: {"message": "User successfully logged in!", 
   "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0d2ViQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0NDQyMDM2LCJleHAiOjE3NDQ1Mjg0MzZ9.4BrF0C5gnbO_bST9VhGjNaZ_ctwhNqqdZIrqWcapgME", 
   "role": "ADMIN", 
   "statusCode": 200, 
   "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0d2ViQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0NDQyMDM2LCJleHAiOjE3NDQ1Mjg0MzZ9.4BrF0C5gnbO_bST9VhGjNaZ_ctwhNqqdZIrqWcapgME"}
 
   
    if (response.statusCode === 200) {
      setLoading(true);
      setError('');
      setToken(response.token);
      await AsyncStorage.setItem('token', response.token);
      navigation.navigate('TabNavigator');
      
    }
    }

  } catch (error) {
    console.log(error)
    setError('Error al iniciar sesión')
    setLoading(false)

  }
    */
    }
    const handleLogin = () => {
      try {
        login();
      } catch (error) {
        console.log(error)
        setError('Error al iniciar sesión')
        setLoading(false)
      }
    }



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
              {/* Botón principal */}
              <Button
                title="Iniciar sesión"
                titleStyle={{ fontSize: 18, color: 'white' }}
                buttonStyle={{
                  backgroundColor: Colors.black,
                  width: 220,
                  borderRadius: 8,
                  paddingVertical: 12,
                }}
                onPress={handleLogin}
              />

              {/* Botón secundario */}
              <Button
                title="Registrate"
                type="outline"
                titleStyle={{ fontSize: 18, color: Colors.black }}
                buttonStyle={{
                  borderColor: Colors.black,
                  borderWidth: 2,
                  width: 220,
                  borderRadius: 8,
                  paddingVertical: 12,
                }}
              />

              {/* Botón terciario */}
              <Button
                title="Ingresar como invitado"
                type="clear"
                titleStyle={{
                  fontSize: 18,
                  color: Colors.brown,
                  textDecorationLine: 'underline',
                }}
                buttonStyle={{
                  width: 220,
                  paddingVertical: 10,
                }}
              />
            </View>



          </View>
        </View>
      </SafeAreaView>
    )
  }


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
