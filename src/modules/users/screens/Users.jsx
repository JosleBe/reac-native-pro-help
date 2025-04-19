import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import UsersService from '../services/UsersService';
import UserService from '../../auth/service/AuthService';
import { Icon, Input } from 'react-native-elements';
import Colors from '../../../utils/Colors';
import Header from '../../../Kernel/components/Header';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUserLoggedIn = async () => {
      const user = await UserService.getProfileInSession();
      setUserLoggedIn(user.user);
    };
    fetchUserLoggedIn();
  }, []);

  const fetchUsers = async () => {
    if (userLoggedIn) {
      const token = await UserService.getToken();
      const users = await UsersService.getUserAllUsers(token, userLoggedIn.email);
      setUsers(users);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [userLoggedIn]);
  
  const handleDisable = async (userId) => {
    Alert.alert('¿Estás seguro de querer deshabilitar este usuario?', 'Esta acción es irreversible', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deshabilitar',
        onPress: async () => {
          const token = await UserService.getToken();
          const response = await UsersService.disableUser(token, userId);
          if (response === 200) {
            Alert.alert('Usuario deshabilitado correctamente');
            fetchUsers(); // Recarga la lista de usuarios después de deshabilitar
          } else {
            Alert.alert('Hubo un error al deshabilitar el usuario');
          }
        },
      },
    ]);
  };

  const filteredUsers = users.filter((user) => {
    const nameMatch = `${user.name} ${user.lastName}`.toLowerCase().includes(searchText.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchText.toLowerCase());
    return nameMatch || emailMatch;
  });

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name} {item.lastName}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.role}>Rol: {item.role}</Text>
        <Text style={styles.status}>
          Estado: {item.enabled ? 'Habilitado' : 'Deshabilitado'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDisable(item.id)}
      >
        <Text style={styles.buttonText}>Deshabilitar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header name="Usuarios"/>

      <Input
        inputContainerStyle={styles.input}
        placeholder="Buscar por nombre o correo"
        value={searchText}
        onChangeText={setSearchText}
        rightIcon={<Icon name="search1" type="antdesign" size={24} color="black" />}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay usuarios disponibles</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderColor: Colors.cielo,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    marginHorizontal: 17,   
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 17,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    fontSize: 14,
  },
  role: {
    fontSize: 13,
    color: '#555',
  },
  status: {
    fontSize: 13,
    color: '#888',
  },
  button: {
    backgroundColor: Colors.black,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',

  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});

export default Users;
