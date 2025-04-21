import React, { useEffect, useRef, useState } from 'react'
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions, Modal, Pressable } from 'react-native'
import { Button, Icon } from 'react-native-elements';
import Colors from '../../../utils/Colors'
import MapView, { Marker } from 'react-native-maps';
import AuthService from '../../auth/service/AuthService'
import DonationService from '../../donations/services/DonationService';
import * as Progress from 'react-native-progress';
import { TouchableOpacity } from 'react-native';
import useComments from '../hooks/useComments';
import CommentForm from '../components/CommentForm';
import ModalDonations from '../components/ModalDonations';
import UserService from '../../auth/service/AuthService';
const imagenes = {
    '/img-camp/img-1.png': require('../../../../assets/img-camp/img-1.png'),
    '/img-camp/img-2.png': require('../../../../assets/img-camp/img-2.png'),
    '/img-camp/img-3.png': require('../../../../assets/img-camp/img-3.png'),
    '/img-camp/img-4.png': require('../../../../assets/img-camp/img-4.png'),
    '/img-camp/img-5.png': require('../../../../assets/img-camp/img-5.png'),
    '/img-camp/img-6.png': require('../../../../assets/img-camp/img-6.png'),
    '/img-camp/img-7.png': require('../../../../assets/img-camp/img-7.jpg'),
    '/img-camp/img-8.png': require('../../../../assets/img-camp/img-8.jpg'),
    '/img-camp/img-9.png': require('../../../../assets/img-camp/img-9.jpg'),
};

const ViewCampaign = ({ route, navigation }) => {
    const { campaign } = route.params;
    const isURL = campaign.image && campaign.image.length > 20;
    const imageSource = isURL ? { uri: campaign.image } : imagenes[campaign.image] || null;
    const [modalVisible, setModalVisible] = useState(false);
    const [modaVisibleDonation, setModalVisibleDonation] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);
    const [profile, setProfile] = useState({});
    const floatAnim = useRef(new Animated.Value(0)).current;
    const cantidad = parseInt(campaign.cantidad.replace(",", ""), 10);
    const { comments, loading } = useComments(campaign.id);
    const [modalVisibleDonationByInsumo, setModalVisibleDonationByInsumo] = useState(false);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const openModalDonation = () => {
        setModalVisibleDonation(true);
    }
    const openModalDonationByInsumo = () => {
        setModalVisibleDonationByInsumo(true);
    }
    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchProfile = async () => {
            const profile = await AuthService.getProfileInSession();
            setProfile(profile);
        };
        fetchProfile();
    }, [profile]);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (cantidad && !isNaN(cantidad) && cantidad > 0) {
            const newProgress = (totalDonations / cantidad) * 100;
            setProgress(Math.min(newProgress, 100));
        }
    }, [totalDonations, cantidad,]);
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const [isAuthenticatedResult, isUserResult] = await Promise.all([
                    UserService.isAuthenticated(),
                    UserService.isUser()
                ]);
                setIsAuthenticated(isAuthenticatedResult);
                setIsUser(isUserResult);
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };

        checkAuthentication();
    }, []);
    useEffect(() => {
        if (!isAuthenticated) return;
        let isMounted = true;
        const fetchTotalDonations = async () => {
            const token = await AuthService.getToken();
            if (!isAuthenticated) return;

            try {
                const data = await (
                    campaign.recursoTipo === "insumo"
                        ? DonationService.getDonationsbyInsumoId(campaign.id, token)
                        : DonationService.getDonationsByCampaignId(campaign.id, token)
                );

                if (!isMounted) return;

                if (campaign.recursoTipo === "insumo") {
                    setTotalDonations(data);
                } else {
                    const total = data.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
                    setTotalDonations(total);
                }
            } catch (error) { }
        };

        fetchTotalDonations();
        return () => { isMounted = false; };
    }, [campaign?.id, campaign?.recursoTipo, profile?.role]);


    const getDay = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date) ? "Fecha inválida" : date.getDate();
    };

    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return isNaN(date) ? "Fecha inválida" : date.toLocaleDateString('es-ES', options);
    };
    const closeAllModals = () => {
        setModalVisibleDonation(false);
        setModalVisibleDonationByInsumo(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <Icon name="arrow-back" type="material" size={24} color="black" onPress={() => navigation.goBack()} />
                <Text style={styles.title}>{campaign.nombre}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>


                    <View style={styles.content}>
                        <Image source={imageSource} style={styles.image} />
                        <View style={styles.containerMap}>
                            <TouchableOpacity onPress={() => setIsMapExpanded(true)}>
                                <MapView style={styles.map}
                                    region={{
                                        latitude: campaign.location.coordinates.lat,
                                        longitude: campaign.location.coordinates.lng,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                >
                                    <Marker
                                        coordinate={{ latitude: campaign.location.coordinates.lat, longitude: campaign.location.coordinates.lng }}
                                        title="Ubicación de la campaña"
                                        pinColor="red"
                                    />
                                </MapView>
                            </TouchableOpacity>


                        </View>
                    </View>

                    <View style={styles.wrapperInfo}>
                        <View style={styles.containerInfo}>
                            <Text style={styles.infoLabel}>Categoría</Text>
                            <Text style={styles.infoText}>{campaign.categoria}</Text>
                            <Text style={styles.infoLabel}>Tipo de recurso</Text>
                            <Text style={[styles.infoText, { backgroundColor: '#ececec' }]}>{campaign.recursoTipo}</Text>
                        </View>

                        <View style={styles.dateContainer}>
                            <View style={styles.dateItem}>
                                <View style={[styles.dateItemTextDay, { backgroundColor: Colors.cielo }]}>
                                    <Text style={styles.dayText}>{getDay(campaign.fechaInicio)}</Text>
                                </View>
                                <View>
                                    <View style={[styles.dateItemTextMonth, { backgroundColor: Colors.cielo }]}>
                                        <Text style={styles.monthText}>{getMonthYear(campaign.fechaInicio)}</Text>
                                    </View>
                                    <Text style={styles.dateLabel}>Fecha inicio</Text>
                                </View>
                            </View>

                            <View style={styles.dateItem}>
                                <View style={[styles.dateItemTextDay, { backgroundColor: Colors.opac }]}>
                                    <Text style={styles.dayText}>{getDay(campaign.fechaFin)}</Text>
                                </View>
                                <View>
                                    <View style={[styles.dateItemTextMonth, { backgroundColor: Colors.opac }]}>
                                        <Text style={styles.monthText}>{getMonthYear(campaign.fechaFin)}</Text>
                                    </View>
                                    <Text style={styles.dateLabel}>Fecha fin</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            Progreso de la campaña: <Text style={{ color: '#B8860B' }}>{Math.round(progress)}%</Text>
                        </Text>
                        <Progress.Bar
                            progress={progress / 100}
                            width={Dimensions.get('window').width * 0.8}
                            height={15}
                            borderRadius={20}
                            color="black"
                            unfilledColor="#f0f0f0"
                            borderWidth={1}
                            borderColor="#ddd"
                            animated
                            useNativeDriver
                        />
                        <Text style={styles.donationInfo}>
                            {totalDonations} / {campaign.cantidad} <Text style={{ fontWeight: 'bold', color: '#B8860B' }}>donaciones</Text>
                        </Text>
                    </View>

                    <View style={styles.descriptionContainer}>

                        <Text style={styles.descriptionTitle}>Descripción</Text>
                        <Text style={styles.descriptionText}>{campaign.descripcion} lo veniam cupiditate! Porrmnis.</Text>


                    </View>

                    <View style={styles.buttonContainer}>

                        {
                            isAuthenticated ? (
                                isUser && (
                                    <View style={styles.buttonItem}>
                                        <Button
                                            containerStyle={styles.buttonItemContainer}
                                            buttonStyle={styles.primaryButton}
                                            titleStyle={{ fontWeight: '700', color: '#efb810', fontSize: 16 }}
                                            title="Hacer una donación"
                                            onPress={() => campaign.recursoTipo === "insumo" ? openModalDonationByInsumo() : openModalDonation()}
                                        />
                                        <Button
                                            containerStyle={styles.buttonItemContainer}
                                            buttonStyle={styles.primaryButton}
                                            titleStyle={{ color: Colors.white, fontWeight: '700', fontSize: 16 }}
                                            title="Inscribirme"
                                        />

                                    </View>


                                )
                            ) : (

                                <View style={{ width: '60%', alignItems: 'center', backgroundColor: 'black', padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.white, textAlign: 'center', color: '#efb810' }}>¡Inicia sesión para realizar una donación
                                        o inscribirte en la campaña!
                                    </Text>
                                </View>
                            )
                        }


                        <View style={styles.buttonItemComment}>
                            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ alignItems: "center" }} >
                                <Animated.View style={[styles.floatingButton, { transform: [{ translateY: floatAnim }] }]}>
                                    <Icon name="comment" type="material" size={24} color="white" />
                                    <View style={styles.notificationDot} />
                                </Animated.View>
                                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Comentarios</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                {
                    // Modal de donaciones COMOPONENT -> ModalDonations

                    <ModalDonations
                        modalVisible={modaVisibleDonation || modalVisibleDonationByInsumo}
                        setModalVisible={closeAllModals}
                        campaignid={campaign.id}
                        userid={profile?.user?.id}
                        email={profile?.user?.email}
                        phone={profile?.user?.phone}
                        name={profile?.user?.name}
                        recursoTipo={campaign.recursoTipo}
                        articulo={campaign.objeto}
                    />
                }
                {
                    //Modal de comentarios
                }

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>

                        <View style={styles.modalContainer}>
                            {/* Encabezado */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Comentarios</Text>
                                <Text style={styles.modalSubtitle}>{comments.length} comentarios</Text>
                                <Pressable onPress={() => setModalVisible(false)}>
                                    <Icon name="chevron-down" type="feather" size={26} color="black" />
                                </Pressable>
                            </View>

                            <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                                {comments.map((c) => (
                                    <View key={c.id} style={styles.commentContainer}>

                                        <View style={styles.commentContent}>
                                            <View style={styles.commentHeader}>
                                                <Text style={styles.commentAuthor}>{c.autor}</Text>
                                                <Text style={styles.commentDate}>
                                                    {new Date(c.fecha).toLocaleString("es-ES", {
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: false,
                                                    }).replace(",", "")}
                                                </Text>
                                            </View>
                                            <View style={styles.commentBox}>
                                                <Text style={styles.commentText}>{c.texto}</Text>
                                            </View>
                                            <Text style={styles.statusText}>Entregado</Text>
                                        </View>
                                    </View>
                                ))}

                            </ScrollView>

                        </View>
                    </View>
                    <CommentForm campaignId={campaign.id} />
                </Modal>
            </ScrollView>
            <Modal visible={isMapExpanded} animationType="slide">
                <View style={styles.expandedMapContainer}>
                    <MapView
                        style={styles.expandedMap}
                        region={{
                            latitude: campaign.location.coordinates.lat,
                            longitude: campaign.location.coordinates.lng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{ latitude: campaign.location.coordinates.lat, longitude: campaign.location.coordinates.lng }}
                            title="Ubicación de la campaña"
                            pinColor="red"
                        />
                    </MapView>
                    <TouchableOpacity onPress={() => setIsMapExpanded(false)} style={styles.closeBtn}>
                        <Text style={styles.closeText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    expandedMapContainer: {
        flex: 1,
    },
    expandedMap: {
        flex: 1,
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 10,
    },
    closeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 10,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    image: {
        width: '40%',
        height: 100,
        borderRadius: 10,
    },
    containerMap: {
        width: '40%',
        height: 100,
        borderRadius: 10,
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    wrapperInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    containerInfo: {
        width: '50%',
    },
    infoLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    },
    infoText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        backgroundColor: '#ececec',
        padding: 8,
        borderRadius: 6,
        marginBottom: 5,
    },
    dateContainer: {
        justifyContent: 'space-around',


    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateItemTextDay: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    dateItemTextMonth: {
        padding: 5,

        borderEndEndRadius: 5,
        borderStartEndRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
    },
    monthText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
    },
    dateLabel: {
        fontSize: 12,
        color: 'black',
        alignSelf: 'center',
    },
    progressContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    donationInfo: {
        fontSize: 13,
        color: '#555',
        marginTop: 5,
    },
    descriptionContainer: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10,

    },
    descriptionTitle: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        padding: 6
    },
    descriptionText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    buttonItem: {
        width: '60%',
        alignItems: 'center',
    },
    buttonItemContainer: {
        marginVertical: 5,
    },
    primaryButton: {
        width: 180,
        height: 45,
        borderRadius: 8,
        backgroundColor: Colors.black,
    },
    buttonItemComment: {
        width: '35%',
        alignItems: 'center',
    },
    floatingButton: {
        width: 50,
        height: 50,
        backgroundColor: Colors.black,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    notificationDot: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 13,
        height: 13,
        borderRadius: 10,
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: 'red',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "90%",
        padding: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
    },
    modalSubtitle: {
        fontSize: 16,
        color: "gray",
    },
    commentContainer: {
        flexDirection: "row",
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    commentAuthor: {
        fontWeight: "bold",
        fontSize: 14,
    },
    commentDate: {
        color: "gray",
        fontSize: 12,
    },
    commentBox: {
        backgroundColor: "#eee",
        borderRadius: 10,
        padding: 8,
        marginTop: 4,
    },
    commentText: {
        fontSize: 14,
    },
    statusText: {
        fontSize: 12,
        color: "gray",
        marginTop: 4,
    },
});

export default ViewCampaign;
