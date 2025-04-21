import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import UserService from './service/AuthService';
import CustomAlert from '../profile/screens/CustomAlert';
import { useNavigation } from '@react-navigation/native';

const CreateAccount = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    direccion: '',
    fecha: '',
    sexo: 'masculino',
    role: 'USER',
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: '',
    message: '',
    type: '',
  });

  const avatars = {
    masculino: require('../../../assets/user-img.png'),
    femenino: require('../../../assets/user-girl.png'),
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    try {
      const response = await UserService.register(form);

      if (response.statusCode === 200) {
        setAlertContent({
          title: 'Éxito',
          message: 'Registro completado con éxito.',
          type: 'success',
        });
      } else {
        setAlertContent({
          title: 'Error',
          message: response.message || 'No se pudo registrar.',
          type: 'error',
        });
      }

      setAlertVisible(true);
    } catch (error) {
      console.error(error);
      setAlertContent({
        title: 'Error',
        message: 'Hubo un problema al registrar.',
        type: 'error',
      });
      setAlertVisible(true);
    }
  };

  const handleAlertClose = () => {
    if (alertContent.type === 'success') {
      navigation.navigate('Login');
    }
    setAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <Image source={avatars[form.sexo]} style={styles.avatar} />

      <TextInput style={styles.input} placeholder="Nombre" onChangeText={text => handleChange('name', text)} />
      <TextInput style={styles.input} placeholder="Apellido" onChangeText={text => handleChange('lastName', text)} />
      <TextInput style={styles.input} placeholder="Correo" onChangeText={text => handleChange('email', text)} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry onChangeText={text => handleChange('password', text)} />
      <TextInput style={styles.input} placeholder="Teléfono" keyboardType="phone-pad" onChangeText={text => handleChange('phone', text)} />
      <TextInput style={styles.input} placeholder="Dirección" onChangeText={text => handleChange('direccion', text)} />
      <TextInput style={styles.input} placeholder="Fecha de nacimiento (YYYY-MM-DD)" onChangeText={text => handleChange('fecha', text)} />

      <Text style={styles.label}>Sexo:</Text>
      <Picker selectedValue={form.sexo} onValueChange={value => handleChange('sexo', value)} style={styles.picker}>
        <Picker.Item label="Masculino" value="masculino" />
        <Picker.Item label="Femenino" value="femenino" />
      </Picker>

      <Button title="Registrar" onPress={handleRegister} />

      <CustomAlert
        visible={alertVisible}
        onClose={handleAlertClose}
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, padding: 10 },
  label: { marginTop: 10, fontWeight: 'bold' },
  picker: { height: 50, marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20 },
});

export default CreateAccount;
