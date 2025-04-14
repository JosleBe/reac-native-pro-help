import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, ScrollView, Modal } from 'react-native';
import Header from '../../../Kernel/components/Header';
import ColorfulCard from '@freakycoder/react-native-colorful-card';
import UserService from '../../auth/service/AuthService';
import DonationService from '../services/DonationService';
import { RefreshControl, } from 'react-native';

import { Icon, Input } from 'react-native-elements';

const Donations = () => {
    const [preDonations, setPreDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);  // Estado para controlar el modal
    const [selectedDonation, setSelectedDonation] = useState(null); // Estado para almacenar la donación seleccionada
    const [selectedCampaignName, setSelectedCampaignName] = useState(null);
    const onRefresh = async () => {
        setRefreshing(true);
        const token = await UserService.getToken();
        try {
            const data = await DonationService.getPrDonations(token);
            setPreDonations(data);
        } catch (error) {
            setError("Error al recargar donaciones");
        } finally {
            setRefreshing(false);
        }
    };
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const token = await UserService.getToken();
            try {
                const data = await DonationService.getPrDonations(token);
                setPreDonations(data);
            } catch (error) {
                setError("Error al obtener las donaciones pendientes");
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []); // Solo se ejecuta una vez al montar el componente

    const openModal = async (donation) => {
        setSelectedDonation(donation);
        setModalVisible(true);
        setSelectedCampaignName(null);

        const token = await UserService.getToken();
        try {
            const campaign = await DonationService.getCampaignById(donation.campaignId, token);

            setSelectedCampaignName(campaign.data.nombre);
        } catch (error) {
            setSelectedCampaignName("Campaña desconocida");
            console.error("Error obteniendo campaña:", error);
        }
    };
    const closeModal = () => {
        setModalVisible(false);  // Cerramos el modal
    };

    const acceptDonation = async () => {
        if (!selectedDonation) return;

        try {
            const token = await UserService.getToken();

            await DonationService.acceptDonation(selectedDonation, token);
            await DonationService.deletePreDonationById(selectedDonation.id, token);
            setPreDonations(prev => prev.filter(d => d.id !== selectedDonation.id));

            Alert.alert("Éxito", "Donación aceptada y eliminada correctamente.");
            closeModal();
            closeModal();
            const data = await DonationService.getPrDonations(token);
            setPreDonations(data);

        } catch (error) {
            console.error("Error al aceptar donación:", error);
            Alert.alert("Error", "No se pudo aceptar la donación.");
        }
    };

    const cancelDonation = () => {
        console.log("Donación cancelada");
        closeModal();  // Cerrar el modal después de cancelar
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header name={"Donaciones"} />
            <Input
                placeholder="Buscar nombre..."
                containerStyle={styles.searchInput}
                inputContainerStyle={{ borderBottomWidth: 0, height: 30 }}
                rightIcon={<Icon name="search" type="font-awesome" size={20} color="#b0b0b0" />}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0984e3" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <ScrollView
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={['#0984e3']} // Android
                      tintColor="#0984e3"  // iOS
                    />
                  }>
                    <View style={styles.rowContainer}>
                        {preDonations.map((donation, index) => (
                            <View key={index} style={styles.cardWrapper}>
                                <ColorfulCard
                                    title={(donation.name).slice(0, 25) + "..."}
                                    value={`¡Quiere donar ${donation.object.articulos.reduce((acc, item) => acc + item.cantidad, 0)} artículos!`}
                                    onPress={() => openModal(donation)}  // Abre el modal con la donación seleccionada
                                    style={styles.card}
                                    titleTextStyle={styles.titleText}
                                    valueTextStyle={styles.valueText}
                                />
                                <TouchableOpacity style={styles.button} onPress={() => openModal(donation)}>
                                    <Text style={styles.buttonText}>Ver Detalles</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}

            {/* Modal de detalles */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Detalles de la Donación</Text>

                        {selectedDonation && (
                            <>
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalLabel}>Donante:</Text>
                                    <Text style={styles.modalValue}>{selectedDonation.name}</Text>
                                </View>
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalLabel}>Correo:</Text>
                                    <Text style={styles.modalValue}>{selectedDonation.email}</Text>
                                </View>

                                {selectedCampaignName && (
                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalLabel}>Campaña:</Text>
                                        <Text style={styles.modalValue}>{selectedCampaignName}</Text>
                                    </View>
                                )}

                                <View style={styles.modalSection}>
                                    <Text style={styles.modalLabel}>Artículos a donar:</Text>
                                    <View style={{ marginTop: 5 }}>
                                        {selectedDonation.object.articulos.map((item, index) => (
                                            <Text key={index} style={styles.articleItem}>
                                                {item.nombre} - {item.cantidad} unidad(es)
                                            </Text>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.modalButtonsContainer}>
                                    <TouchableOpacity style={styles.acceptButton} onPress={acceptDonation}>
                                        <Text style={styles.buttonText}>Aceptar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.cancelButton} onPress={cancelDonation}>
                                        <Text style={styles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    cardWrapper: {
        width: '48%', // 48% para dejar espacio entre las tarjetas
        marginVertical: 10,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        height: 120,
    },
    titleText: {
        color: "black",
        fontWeight: "800",
        fontSize: 16,
        marginBottom: -5,
        flexWrap: "wrap",
    },
    valueText: {
        color: "#D4AF37",
        fontSize: 16,
        top: -17,
        fontWeight: "900",
    },
    button: {
        marginTop: 7,
        backgroundColor: "black",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: "flex-center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
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

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2d3436',
    },
    modalSection: {
        marginBottom: 15,
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#636e72',
    },
    modalValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2d3436',
        marginTop: 4,
    },
    articleItem: {
        fontSize: 15,
        color: '#2d3436',
        paddingVertical: 2,
        paddingLeft: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#dfe6e9',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    acceptButton: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#d63031',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Donations;
