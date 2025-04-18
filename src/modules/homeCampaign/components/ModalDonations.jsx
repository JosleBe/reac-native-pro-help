import React, { useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import Colors from '../../../utils/Colors';
import PayPalImage from '../img/PayPal.png';
import PayIt from '../service/PayIt';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, PORT } from '@env'
const ModalDonations = ({ modalVisible, setModalVisible, userid, campaignid, email, phone, name, recursoTipo, articulo }) => {

    const [approvalUrl, setApprovalUrl] = useState(null);
    const [webviewVisible, setWebviewVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const webviewRef = useRef(null);
    const CANTIDADES = [100, 200, 300, 400, 500, 1000];
    const [amount, setAmount] = useState('');
    const [selectedArticulos, setSelectedArticulos] = useState({});
    const [articulos, setArticulos] = useState(articulo?.articulos);
   
    const handleDonate = async () => {
        if (recursoTipo === "insumo") {
            const donaciones = Object.entries(selectedArticulos)
                .filter(([_, cantidad]) => cantidad > 0)
                .map(([nombre, cantidad]) => ({ nombre, cantidad }));
    
            if (donaciones.length === 0) {
                Alert.alert('Atención', 'Selecciona al menos un artículo para donar.');
                return;
            }
    
            try {
                const token = await AsyncStorage.getItem('token');
    
                const response = await fetch(`${API_URL}:${PORT}/api/pre-donation/pre-donate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        recurso: "insumo",
                        donaciones,
                        campaignId: campaignid,
                        donorId: userid,
                        email: email,
                        phone: phone,
                        name: name
                    })
                });
    
                if (!response.ok) throw new Error("Error al procesar la donación de insumos");
    
                const updatedData = await response.json();
                setArticulos(updatedData.articulos);
                setSelectedArticulos({});
    
                Alert.alert('¡Gracias!', 'Donación de insumos realizada con éxito.');
                setModalVisible(false);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Hubo un problema al procesar tu donación.');
            }
        } else {
            const amountFloat = parseFloat(amount);
            if (isNaN(amountFloat) || amountFloat <= 0) {
                Alert.alert('Error', 'Por favor, ingrese un monto válido');
                return;
            }
    
            Alert.alert('Confirmación', `¿Estás seguro de querer donar $${amount}?`, [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar', onPress: () => {
                        byPaypal(); // Llama al método de pago
                    }
                },
            ]);
        }
    };
    
    const handleCantidadChange = (nombre, cantidad) => {
        setSelectedArticulos((prev) => ({
            ...prev,
            [nombre]: cantidad,
        }));
    };
    const byPaypal = async () => {
        const pago = {
            idUsuario: userid,
            idCampania: campaignid,
            amount,
            currency_code: "USD",
        };

        const response = await PayIt.payTo(pago, (url) => {
            setApprovalUrl(url);
            setWebviewVisible(true);
        });
    };

    const handleNavigationChange = async (navState) => {
        const { url } = navState;

        if (url.includes('/capture-order?token=')) {
            setLoading(true); // Muestra el loader

            try {
                const token = new URL(url).searchParams.get("token");
                setWebviewVisible(false);
                const transactionDetails = await PayIt.capturePayment(token);

                if (transactionDetails.status === 'success') {
                    const now = new Date();
                    const offsetMs = now.getTimezoneOffset() * 60000;
                    const localDate = new Date(now.getTime() - offsetMs).toISOString().split('.')[0];

                    const payload = {
                        campaignId: campaignid,
                        amount: parseFloat(amount),
                        donationDate: localDate,
                        donorId: userid,
                        email: email,
                        phone: phone,
                        name: name,
                    };

                    const report = await PayIt.registerDonation(payload);

                }
            } catch (error) {
                console.error("Error en el pago o registro:", error);
                Alert.alert("Error", "Hubo un problema al procesar la donación.");
            } finally {
                setLoading(false);
                setModalVisible(false);
                setWebviewVisible(false);
                Alert.alert("Gracias", "Gracias por tu donación.");

            }
        }

        if (url.includes('/cancel-payment')) {
            setWebviewVisible(false);
            Alert.alert("Cancelado", "El pago fue cancelado.");
        }
    };

    return (
        <>
            {recursoTipo === "insumo" ? (

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>INGRESA EL MONTO DESEADO</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Icon name="close" type="antdesign" size={22} color="black" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    {articulos?.map((articulo, index) => (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginVertical: 10 }}>
                                            {/* Nombre del Artículo */}
                                            <View style={{ justifyContent: 'center', flex: 1 }}>
                                                <Text style={styles.articuloText}>{articulo.nombre}</Text>
                                            </View>

                                            {/* Input de cantidad y Meta */}
                                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 120 }}>
                                                <Input
                                                    placeholder='Cantidad'
                                                    placeholderTextColor='gray'
                                                    keyboardType='numeric'
                                                     value={selectedArticulos[articulo.nombre] || ""}
                                                    onChangeText={(text) => handleCantidadChange(articulo.nombre, text)}
                                                    inputContainerStyle={{
                                                        width: '100%',
                                                        height: 30,
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        borderColor: "#d0d0d0",
                                                    }}
                                                    inputStyle={{ textAlign: 'center' }}
                                                    min={0}
                                                />
                                                <Text style={{ fontSize: 12, color: Colors.gray, textAlign: 'center', }}>
                                                    Meta: {articulo.cantidad} artículos
                                                </Text>
                                                <View style={{ height: 1, width: '100%', backgroundColor: '#d0d0d0', marginVertical: 5 }} />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Donar"
                                    titleStyle={styles.buttonText}
                                    buttonStyle={styles.buttonStyle}
                                    onPress={handleDonate}
                                />

                            </View>
                        </View>
                    </View>
                </Modal>

            ) : (

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            {loading && (
                                <View style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro para resaltar el loader
                                    zIndex: 100, // Asegura que esté encima de todo
                                }}>
                                    <ActivityIndicator size="large" color="#ffffff" />
                                </View>
                            )}

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>INGRESA EL MONTO DESEADO</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Icon name="close" type="antdesign" size={22} color="black" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalContent}>
                                {CANTIDADES.map((cantidad, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.amountStyle}
                                        onPress={() => setAmount(String(cantidad))}
                                    >
                                        <Text style={styles.amountText}>${cantidad}</Text>
                                    </TouchableOpacity>
                                ))}

                                <Input
                                    placeholder="Ingresar monto $100"
                                    placeholderTextColor={Colors.gray}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    value={`${amount}`}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setAmount(text)}
                                    leftIcon={<Icon name="dollar" type="font-awesome" size={12} color={Colors.gray} />}
                                />

                                <View style={styles.buttonContainer}>
                                    <Button
                                        title="Donar"
                                        titleStyle={styles.buttonText}
                                        buttonStyle={styles.buttonStyle}
                                        onPress={handleDonate}
                                    />
                                    <Image source={PayPalImage} style={styles.paypalImage} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Modal para WebView */}
                    <Modal visible={webviewVisible} animationType="slide">
                        {approvalUrl ? (
                            <WebView
                                ref={webviewRef}
                                source={{ uri: approvalUrl }}
                                onNavigationStateChange={handleNavigationChange}
                                startInLoadingState
                                renderLoading={() => <ActivityIndicator size="large" />}
                            />
                        ) : null}
                    </Modal>
                </Modal>
            )}
        </>
    )
}

const styles = StyleSheet.create({

    modalBackground: {
        flex: 1,
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: 100,

    },
    modalContainer: {
        width: '90%',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
        padding: 20,
        borderRadius: 10,

    },
    modalTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'right',

    },
    modalContent: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        height: 230,
        marginTop: 10,
    },
    amountStyle: {
        width: 70,
        height: 40,
        backgroundColor: Colors.white,
        boxShadow: '0px 0px 10px 0xp rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        margin: 5,
    },
    amountText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 10,
    },
    inputContainerStyle: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        height: 35,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#efb810',
    },
    buttonStyle: {
        backgroundColor: 'black',

        width: 120,
        borderRadius: 10,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
        flexDirection: 'row',
    },
    paypalImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },

    articuloText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        width: 90

    },
    inputStyle: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 16,
    },



})

export default ModalDonations
