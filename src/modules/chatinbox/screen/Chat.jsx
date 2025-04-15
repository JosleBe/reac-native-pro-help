import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ScrollView
} from 'react-native';
import { db } from '../../../Kernel/config/firebase-config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Header from '../../../Kernel/components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon, Image, Input } from 'react-native-elements';
import UserImage from '../img/user-img.png';
export default function ChatScreen() {
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const scrollRef = useRef();
    const getUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('profileInfo');
            if (jsonValue) {
                setUser(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error("Error al leer usuario:", e);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    console.log("Usuario:", user);
    const email = user?.user?.email;
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get(`http://192.168.100.184:8080/api/${email}/contacts`);
                if (res.data) setContacts(res.data);
                console.log("Contactos:", res.data);
            } catch (err) {
                console.error("Error al cargar los contactos:", err);
            }
        };

        if (email) fetchContacts();
    }, [email]);

    useEffect(() => {
        if (!activeChat) return;

        const chatId = getChatId(email, activeChat.email);
        const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(newMessages);
        });

        return () => unsubscribe();
    }, [activeChat, email]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeChat) return;

        const chatId = getChatId(email, activeChat.email);
        const message = {
            text: newMessage,
            sender: email,
            recipient: activeChat.email,
            timestamp: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, `chats/${chatId}/messages`), message);
            await axios.post('http://192.168.100.184:8080/api/send', {
                emisorEmail: email,
                receptorEmail: activeChat.email,
                texto: newMessage,
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    };

    const getChatId = (userEmail, otherEmail) => {
        return [userEmail, otherEmail].sort().join('_');
    };

    const filteredContacts = contacts.filter(contact =>
        contact.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {!activeChat ? (
                <>
                    <Header name={"Contactos"} />
                    <View style={styles.container}>
                        <Input
                            placeholder="Buscar contacto..."
                            containerStyle={styles.searchInput}
                            inputContainerStyle={{ borderBottomWidth: 0, height: 30 }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            rightIcon={<Icon name="search" type="font-awesome" size={20} color="#b0b0b0" />}
                        />

                        <ScrollView>
                            {filteredContacts.map((contact) => (
                                <TouchableOpacity
                                    key={contact.email}
                                    style={[
                                        styles.contactItem,
                                        activeChat?.email === contact.email && styles.activeContact,
                                    ]}
                                    onPress={() => setActiveChat(contact)}
                                >
                                    <View style={styles.boxContact}>
                                        <Image
                                            source={UserImage}
                                            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                                        />
                                        <View style={styles.dataContact}>
                                            <Text style={styles.contactName}>{contact.nombre}</Text>
                                            <Text style={styles.contactEmail}>{contact.email}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </>
            ) : (
                <View style={styles.chatContainer}>
                    <TouchableOpacity onPress={() => setActiveChat(null)} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Volver</Text>
                        <View style={styles.boxContact}>
                            <View style={styles.dataContact}>
                                <Text style={styles.nameTitle}>{activeChat.nombre}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <FlatList
                        ref={scrollRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View

                            >
                                {
                                    item.sender === email ? (
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <View style={{ maxWidth: '80%', backgroundColor: '#d1e7dd', borderRadius: 10, padding: 10, marginVertical: 4 }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Yo</Text>
                                                <Text style={{ flexWrap: 'wrap' }}>{item.text}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <View style={{ maxWidth: '80%', backgroundColor: '#f1f1f1', borderRadius: 10, padding: 10, marginVertical: 4 }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{activeChat?.nombre || 'Contacto'}</Text>
                                                <Text style={{ flexWrap: 'wrap' }}>{item.text}</Text>
                                            </View>
                                        </View>
                                    )
                                }


                            </View>
                        )}
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                    />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={90}
                        style={styles.inputContainer}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="Escribe un mensaje..."
                            value={newMessage}
                            onChangeText={setNewMessage}
                        />
                        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                            <AntDesign name="arrowright" size={24} color="white" />
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )}
        </>


    );



}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    nameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    backButton: {
        padding: 5,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',



    },
    backButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    boxContact: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    dataContact: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        width: 210,
    },

    searchInput: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderRadius: 8,
        alignItems: 'center',
        height: 35,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        borderColor: '#b0b0b0'
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        marginBottom: 5,
        width: '90%',
        alignSelf: 'center',

    },
    activeContact: {
        backgroundColor: '#f0f0f0',
    },
    contactName: {
        fontWeight: 'bold',
        color: '#333',
    },
    contactEmail: {
        color: '#666',
    },
    chatContainer: {
        width: '100%',
        padding: 10,
        flex: 1,
        marginTop: 30,

        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    messageBubble: {
        padding: 8,
        justifyContent: 'space-between',
        marginVertical: 5,
        borderRadius: 8,
        maxWidth: '75%',

    },
    myMessage: {
        backgroundColor: '#d0f0c0',
        alignSelf: 'flex-end',
        justifyContent: 'space-between'
    },
    theirMessage: {
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 2,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#000',
        padding: 8,
        borderRadius: 10,
    },
});

