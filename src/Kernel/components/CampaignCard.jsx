import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LocationModal from './LocationModal';
import { Icon, Image } from 'react-native-elements';
import Colors from '../../utils/Colors';

const CampaignCard = ({ item, backgroundColor, onPress, navigation }) => {
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
                    <Text numberOfLines={1} style={styles.title}>{item.nombre?.toUpperCase() || 'SIN NOMBRE'}</Text>
                    <Text style={styles.description} numberOfLines={4} lineBreakMode='clip'>
                        {item.descripcion.trim() || 'Sin descripción disponible'}
                    </Text>

                    <View style={styles.data}>
                        <View>
                            <Text style={styles.footerLabel}>Tipo de recurso</Text>
                            <View style={styles.dataItem}>
                                <Text style={styles.value}>{item.recursoTipo?.toUpperCase() || 'No especificado'}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.footerLabel}>Categoría</Text>
                            <View style={styles.dataItem2}>
                                <Text numberOfLines={2} style={styles.footerValue}>{item.categoria?.trim() || 'No especificada'}</Text>
                            </View>
                        </View>
                    </View>
                    <Image source={item.localImage} style={styles.image} />
                    <View style={styles.footerRow}>
                        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.locationBtn}>
                            <Icon name="location-on" type="material" size={18} color="red" style={{ marginRight: 4 }} />
                            <Text style={styles.footerAction}>Ver ubicación</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionContainer}>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ViewCampaign', { campaign: item, navigation: navigation })}>
                            <Text style={styles.actionText}>Ver campaña</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionText}>Historial</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionText}>Deshabilitar</Text>
                        </TouchableOpacity>
                    </View>



                </View>
            </TouchableOpacity>

            <LocationModal visible={showModal} onClose={() => setShowModal(false)} location={location} />

        </>
    );
};

export default CampaignCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginVertical: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        width: '90%',
        alignSelf: 'center',
        height: 350,


    },
    content: {
        flex: 1,
        position: 'relative',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: 'black',
        marginBottom: 4,
        paddingTop: 10,
        paddingHorizontal: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: 'black',
        fontWeight: '500',
        textAlign: 'justify',
        height: 80,
        width: '100%',
        backgroundColor: Colors.cielo,
        padding: 5,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    value: {
        fontSize: 14,
        color: 'white',

        fontWeight: 'bold',

    },
    footerLabel: {
        fontSize: 12,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerValue: {
        fontSize: 13,
        color: 'black',
        fontWeight: '600',
        flexWrap: 'wrap',
        width: 120,
        textAlign: 'center',

    },
    locationIcon: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: "white",
        padding: 8,
        borderRadius: 20,

    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 16,
    },
    data: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    dataItem: {
        borderColor: 'black',
        padding: 6,
        borderRadius: 10,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2
    },
    dataItem2: {
        borderColor: 'black',
        padding: 6,
        borderRadius: 10,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: Colors.opac,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'center',
    },

    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    footerAction: {
        fontSize: 14,
        fontWeight: '600',
        color: 'red',
    },

    footerActions: {
        flexDirection: 'row',
        marginTop: 'auto',
    },

    actionBtn: {
        backgroundColor: Colors.brown,
        paddingVertical: 6,

    },

    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    actionContainer: {
        width: '100%',
        marginTop: 'auto',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        backgroundColor: Colors.brown,
        borderEndEndRadius: 12,
        borderEndStartRadius: 12,
        paddingVertical: 5,
        marginTop: 5
    }
});
