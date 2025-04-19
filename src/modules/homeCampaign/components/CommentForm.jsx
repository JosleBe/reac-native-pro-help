import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Image,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AuthService from '../../../modules/auth/service/AuthService';
import CampaignService from '../../../modules/homeCampaign/service/CampaignService';
import UserService from '../../../modules/auth/service/AuthService';

const CommentForm = ({ campaignId }) => {
    const [texto, setTexto] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [admins, setAdmins] = useState([]);
    const [profile, setProfile] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const checkAuth = async () => {
            const auth = await UserService.isAdmin();
            setIsAdmin(auth);
        };
        checkAuth();
    }, []);
    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchProfile = async () => {
            const user = await AuthService.getProfileInSession();
            setProfile(user.user);

        };
        fetchProfile();
    }, [campaignId]);
    useEffect(() => {
        const checkAuth = async () => {
            const auth = await UserService.isAuthenticated();
            setIsAuthenticated(auth);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchAdmins = async () => {
            if (profile?.role === 'guest') return;
            const token = await AuthService.getToken();
            const data = await AuthService.getAllAdmins(token);
            console.log(data);
            setAdmins(data);
        };

        if (showModal && admins.length === 0) {
            fetchAdmins();
        }
    }, [showModal]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            Alert.alert("Error", "Inicia sesión para enviar un comentario.");
            return;
        }
        await CampaignService.handleSubmit(texto, image, campaignId, setTexto, setImage);
        Alert.alert("Éxito", "Comentario enviado");
    };

    const handlePrivateMessage = async () => {
        if (!isAuthenticated) {
            Alert.alert("Error", "Inicia sesión para enviar un mensaje privado.");
            return;
        }
        try {
            Alert.alert("Enviando...", "Procesando mensaje privado...");
            await CampaignService.handlePrivate(
                newMessage,
                profile.email,
                admins,
                CampaignService.getChatId,
                setNewMessage,
                setShowModal
            );
            Alert.alert("Éxito", "Mensaje privado enviado");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Hubo un problema al enviar el mensaje privado.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>

                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={100}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                            <TextInput
                                style={styles.textInput}
                                placeholder="Escribe un comentario..."
                                placeholderTextColor="gray"
                                value={texto}
                                onChangeText={setTexto}
                                multiline
                                numberOfLines={4}
                            />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>

                {isAuthenticated === false || isAdmin ? (
                    <></>
                ) : (<TouchableOpacity onPress={() => setShowModal(true)}>
                    <Feather name="lock" size={22} color="gray" />
                </TouchableOpacity>)}

                <TouchableOpacity onPress={handleSubmit} disabled={uploading || !texto.trim()}>
                    <Ionicons name="send" size={22} color={texto.trim() ? "#007BFF" : "gray"} />
                </TouchableOpacity>
            </View>

            {image && (
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
            )}

            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enviar mensaje privado</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Escribe tu mensaje"
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeBtn}>
                                <Text style={styles.closeText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePrivateMessage} style={styles.sendBtn}>
                                <Text style={styles.sendText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CommentForm;

const styles = StyleSheet.create({
    container: {
        marginVertical: 7,
        paddingHorizontal: 16,
        flex: 1,  // Aseguramos que el contenedor principal ocupe el espacio necesario
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        alignItems: 'center',
        elevation: 2,
        gap: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: 'black',
        paddingHorizontal: 10,
        maxHeight: 100,
        minHeight: 40,
    },
    previewImage: {
        marginTop: 10,
        height: 100,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
    closeBtn: {
        padding: 8,
    },
    closeText: {
        color: 'gray',
    },
    sendBtn: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
