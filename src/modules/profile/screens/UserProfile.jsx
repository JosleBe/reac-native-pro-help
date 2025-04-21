import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Modal,
    Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../../Kernel/components/Header';
import { Input, Button } from 'react-native-elements';
import ProfileService from '../service/ProfileServices';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from './CustomAlert';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: '',
        message: '',
        type: 'info'
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProfileVisible, setModalProfileVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [changing, setChanging] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        direccion: '',
        fechaNacimiento: '',
        role: '',
        sexo: '',
    });

    const navigation = useNavigation();

    const avatars = {
        masculino: require('../../../../assets/user-img.png'),
        femenino: require('../../../../assets/user-girl.png'),
    };

    const showAlert = (title, message, type = 'info') => {
        setAlertContent({ title, message, type });
        setAlertVisible(true);
    };

    const getUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('profileInfo');
            if (jsonValue) {
                const parsed = JSON.parse(jsonValue);
                setUser(parsed.user);
                setUpdatedUser({
                    name: parsed.user.name,
                    lastName: parsed.user.lastName,
                    email: parsed.user.email,
                    phone: parsed.user.phone,
                    direccion: parsed.user.direccion,
                    fechaNacimiento: parsed.user.fechaNacimiento,
                    role: parsed.user.role,
                    sexo: parsed.user.sexo,
                });
            }
        } catch (error) {
            console.error('Error cargando perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            showAlert('Campos requeridos', 'Por favor llena todos los campos.', 'error');
            return;
        }

        try {
            setChanging(true);
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                showAlert('⚠️ Error', 'No se encontró el token de autenticación.', 'error');
                return;
            }

            const response = await ProfileService.changePassword(
                {
                    email: user.email,
                    password: currentPassword,
                    newPassword: newPassword
                },
                token
            );

            showAlert('Éxito', 'Contraseña cambiada correctamente.', 'success');
            setModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            console.error('Error cambiando contraseña:', error.response?.data || error.message);
            showAlert('Error', error.response?.data || 'Ocurrió un error.', 'error');
        } finally {
            setChanging(false);
        }
    };

    const handleUpdateUser = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            showAlert('⚠️ Error', 'No se encontró el token de autenticación.', 'error');
            return;
        }

        try {
            setChanging(true);

            const response = await ProfileService.updateUser(user.id, updatedUser, token);

            if (response.statusCode === 200) {
                showAlert('Éxito', 'Perfil actualizado correctamente.', 'success');
                setUser(response.user);
                await AsyncStorage.setItem(
                    'profileInfo',
                    JSON.stringify({ user: response.user })
                );
                setModalProfileVisible(false);
            }
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            showAlert('Error', 'No se pudo actualizar el perfil.', 'error');
        } finally {
            setChanging(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            navigation.replace('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Header name="Mi Perfil" color="#fff" />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4c669f" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.profileContainer}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={user?.sexo ? avatars[user.sexo] : avatars.default}
                                style={styles.avatar}
                                accessibilityLabel={`Avatar de usuario ${user?.sexo || 'default'}`}
                            />
                            {modalProfileVisible && (
                                <TouchableOpacity
                                    style={styles.editIcon}
                                    onPress={() => setModalProfileVisible(true)}
                                >
                                    <Icon name="edit" size={16} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={styles.name}>{user?.name} {user?.lastName}</Text>
                        <Text style={styles.roleBadge}>{user?.role}</Text>

                        <View style={styles.infoCard}>
                            <View style={styles.infoItem}>
                                <Icon name="email" size={20} color="#4c669f" style={styles.infoIcon} />
                                <View>
                                    <Text style={styles.label}>Correo electrónico</Text>
                                    <Text style={styles.value}>{user?.email}</Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <Icon name="phone" size={20} color="#4c669f" style={styles.infoIcon} />
                                <View>
                                    <Text style={styles.label}>Teléfono</Text>
                                    <Text style={styles.value}>{user?.phone || 'No proporcionado'}</Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <Icon name="home" size={20} color="#4c669f" style={styles.infoIcon} />
                                <View>
                                    <Text style={styles.label}>Dirección</Text>
                                    <Text style={styles.value}>{user?.direccion || 'No proporcionada'}</Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <Icon name="cake" size={20} color="#4c669f" style={styles.infoIcon} />
                                <View>
                                    <Text style={styles.label}>Fecha de nacimiento</Text>
                                    <Text style={styles.value}>{user?.fechaNacimiento || 'No proporcionada'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => setModalProfileVisible(true)}
                            >
                                <Icon name="edit" size={18} color="#fff" />
                                <Text style={styles.actionButtonText}>Editar Perfil</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.passwordButton]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Icon name="lock" size={18} color="#fff" />
                                <Text style={styles.actionButtonText}>Cambiar Contraseña</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Icon name="exit-to-app" size={18} color="#d63031" />
                            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* Modal para cambiar contraseña */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => {
                    setModalVisible(false);
                    setCurrentPassword('');
                    setNewPassword('');
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cambiar contraseña</Text>

                        <Input
                            placeholder="Contraseña actual"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            containerStyle={styles.input}
                        />
                        <Input
                            placeholder="Nueva contraseña"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            containerStyle={styles.input}
                        />

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancelar"
                                type="outline"
                                buttonStyle={styles.cancelBtn}
                                onPress={() => {
                                    setModalVisible(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                }}
                            />
                            <Button
                                title={changing ? 'Cambiando...' : 'Guardar'}
                                loading={changing}
                                buttonStyle={styles.saveBtn}
                                onPress={handleChangePassword}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal para modificar perfil */}
            <Modal
                visible={modalProfileVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => {
                    setModalProfileVisible(false);
                    setUpdatedUser({
                        name: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        direccion: '',
                        fechaNacimiento: '',
                        role: '',
                        sexo: ''
                    });
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modificar perfil</Text>

                        <Input
                            placeholder="Nombre"
                            value={updatedUser.name}
                            onChangeText={(text) => setUpdatedUser({ ...updatedUser, name: text })}
                            containerStyle={styles.input}
                        />
                        <Input
                            placeholder="Apellido"
                            value={updatedUser.lastName}
                            onChangeText={(text) => setUpdatedUser({ ...updatedUser, lastName: text })}
                            containerStyle={styles.input}
                        />
                        <Input
                            placeholder="Correo electrónico"
                            value={updatedUser.email}
                            onChangeText={(text) => setUpdatedUser({ ...updatedUser, email: text })}
                            containerStyle={styles.input}
                        />
                        <Input
                            placeholder="Teléfono"
                            value={updatedUser.phone}
                            onChangeText={(text) => setUpdatedUser({ ...updatedUser, phone: text })}
                            containerStyle={styles.input}
                        />
                        <Input
                            placeholder="Dirección"
                            value={updatedUser.direccion}
                            onChangeText={(text) => setUpdatedUser({ ...updatedUser, direccion: text })}
                            containerStyle={styles.input}
                        />
                        <Input
                            placeholder="Fecha de nacimiento"
                            value={updatedUser.fechaNacimiento}
                            onChangeText={(text) => setUpdatedUser({ ...updatedUser, fechaNacimiento: text })}
                            containerStyle={styles.input}
                        />

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancelar"
                                type="outline"
                                buttonStyle={styles.cancelBtn}
                                onPress={() => {
                                    setModalProfileVisible(false);
                                    setUpdatedUser({
                                        name: '',
                                        lastName: '',
                                        email: '',
                                        phone: '',
                                        direccion: '',
                                        fechaNacimiento: '',
                                        role: '',
                                        sexo: ''
                                    });
                                }}
                            />
                            <Button
                                title={changing ? 'Guardando...' : 'Guardar'}
                                loading={changing}
                                buttonStyle={styles.saveBtn}
                                onPress={handleUpdateUser}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <CustomAlert
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertContent.title}
                message={alertContent.message}
                type={alertContent.type}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    header: {
        backgroundColor: '#4c669f',
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scroll: {
        padding: 15,
        paddingBottom: 30,
    },
    profileContainer: {
        alignItems: 'center',
        width: '100%',
    },
    avatarContainer: {
        marginTop: -25,
        marginBottom: 15,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
        backgroundColor: '#e1e8ed',
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#4c669f',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2d3436',
    },
    roleBadge: {
        backgroundColor: '#dfe6e9',
        color: '#4c669f',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
        fontWeight: '600',
        marginBottom: 20,
        fontSize: 14,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 25,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoIcon: {
        marginRight: 15,
        width: 30,
        textAlign: 'center',
    },
    label: {
        fontSize: 12,
        color: '#7f8c8d',
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        color: '#2d3436',
        fontWeight: '500',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: width * 0.43,
    },
    editButton: {
        backgroundColor: '#4c669f',
    },
    passwordButton: {
        backgroundColor: '#00b894',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        backgroundColor: 'rgba(214, 48, 49, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(214, 48, 49, 0.3)',
        width: '100%',
    },
    logoutButtonText: {
        color: '#d63031',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 25,
        width: '90%',
        borderRadius: 15,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2d3436',
    },
    input: {
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    cancelBtn: {
        borderColor: '#d63031',
        borderWidth: 1,
        width: '70%',
        borderRadius: 8,
        paddingVertical: 10,
        alignSelf: 'flex-start',
    },
    saveBtn: {
        backgroundColor: '#4c669f',
        borderRadius: 8,
        paddingVertical: 10,
        width: '70%',
        alignSelf: 'flex-end',
    },
});

export default UserProfile;