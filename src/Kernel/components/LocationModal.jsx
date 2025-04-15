import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

const LocationModal = ({ visible, onClose, location }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                    <MapView
                        style={styles.map}
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={location}
                            title="Ubicación de la campaña"
                            pinColor="red"
                        />
                    </MapView>
                </View>
            </View>
        </Modal>
    );
};

export default LocationModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        margin: 20,
        height: 400,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: '#3b8e9c',
        padding: 8,
        borderRadius: 20,
    },
    map: {
        flex: 1,
    },
});
