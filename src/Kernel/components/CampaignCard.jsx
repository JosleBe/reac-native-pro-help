import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationModal from './LocationModal';

const CampaignCard = ({ item, backgroundColor, onPress }) => {
    const [showModal, setShowModal] = useState(false);

    const location = {
        latitude: item?.location?.coordinates?.lat || 18.8503443,
        longitude: item?.location?.coordinates?.lng || -99.2007355,
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.card, { backgroundColor }]}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>{item.nombre?.toUpperCase() || 'SIN NOMBRE'}</Text>
                    <Text style={styles.description}>{item.descripcion || 'Sin descripción disponible'}</Text>

                    <Text style={styles.footerLabel}>Tipo de recurso:</Text>
                    <Text style={styles.value}>{item.recursoTipo?.toUpperCase() || 'No especificado'}</Text>

                    <Text style={styles.footerLabel}>Categoría:</Text>
                    <Text style={styles.footerValue}>{item.categoria?.trim() || 'No especificada'}</Text>

                    <TouchableOpacity onPress={() => setShowModal(true)} style={styles.locationIcon}>
                        <Icon name="location-outline" size={22} color="#FF0000" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            <LocationModal visible={showModal} onClose={() => setShowModal(false)} location={location} />
        </>
    );
};

export default CampaignCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        marginVertical: 10,
        elevation: 4,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: '100%',
    },
    content: {
        flex: 1,
        position: 'relative',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#f2f2f2',
        textAlign: 'justify',
        marginBottom: 6,
    },
    value: {
        fontSize: 14,
        color: '#f5f5f5',
        marginBottom: 4,
    },
    footerLabel: {
        fontSize: 12,
        color: '#eee',
        fontWeight: 'bold',
        marginTop: 6,
    },
    footerValue: {
        fontSize: 13,
        color: '#fff',
    },
    locationIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
    },
});
