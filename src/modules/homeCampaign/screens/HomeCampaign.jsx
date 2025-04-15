import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import UserService from '../../auth/service/AuthService';
import Header from '../../../Kernel/components/Header';
import CampaignCard from '../../../Kernel/components/CampaignCard';

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

const HomeCampaign = () => {
  const [campañas, setCampañas] = useState([]);
  const [error, setError] = useState(null);

  const obtenerCampanias = async () => {
    try {
      const campañas = await UserService.getAllCampaigns();
      setCampañas(campañas);
    } catch (err) {
      setError('Error al obtener campañas');
      console.log('Problemas al obtener campañas', err);
    }
  };

  useEffect(() => {
    obtenerCampanias();
  }, []);

  let shuffledColors = [];
let colorIndex = 0;

const getUniqueColor = () => {
  const baseColors = [
    '#4A6FA5',
    '#3B3F58',
    '#729B79',
    '#D9B08C',
    '#91684A',
  ];

  if (shuffledColors.length === 0 || colorIndex >= baseColors.length) {
    shuffledColors = [...baseColors].sort(() => Math.random() - 0.5);
    colorIndex = 0;
  }

  return shuffledColors[colorIndex++];
};

  const renderItem = ({ item }) => {
    const isURL = item.image && item.image.length > 20;
    const imageSource = isURL ? { uri: item.image } : imagenes[item.image] || null;

    return (
      <CampaignCard
        item={{ ...item, localImage: imageSource }}
        backgroundColor={getUniqueColor()}
        onPress={() => console.log('Campaña presionada:', item.nombre)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header name={'Campañas'} />
      <FlatList
        data={campañas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default HomeCampaign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
});
