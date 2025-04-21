import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Text, TextInput } from 'react-native';
import UserService from '../../auth/service/AuthService';
import Header from '../../../Kernel/components/Header';
import CampaignCard from '../../../Kernel/components/CampaignCard';
import Colors from '../../../utils/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';  // <-- Importar Picker desde el paquete adecuado

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

const HomeCampaign = ({ navigation }) => {
  const [campañas, setCampañas] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');

  const obtenerCampanias = async () => {
    try {
      const campañas = await UserService.getAllCampaigns();
      setCampañas(campañas);
      setFilteredCampaigns(campañas); 
    } catch (err) {
      setError('Error al obtener campañas');
      console.log('Problemas al obtener campañas', err);
    }
  };

  const filterCampaigns = () => {
    let filtered = campañas;

    if (selectedCategory) {
      filtered = filtered.filter(campaign => campaign.categoria === selectedCategory);
    }

    if (selectedCampaign) {
      filtered = filtered.filter(campaign => campaign.nombre.toLowerCase().includes(selectedCampaign.toLowerCase()));
    }

    setFilteredCampaigns(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      obtenerCampanias();
    }, [])
  );

  useEffect(() => {
    filterCampaigns();
  }, [selectedCategory, selectedCampaign]);

  let shuffledColors = [];
  let colorIndex = 0;

  const getUniqueColor = () => {
    const baseColors = [Colors.white];
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
        onPress={() => navigation.navigate('ViewCampaign', { campaign: item, navigation: navigation })}
        navigation={navigation}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header name={'Campañas'} />

      {/* Filtros */}
      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre de campaña"
          value={selectedCampaign}
          onChangeText={setSelectedCampaign}
        />
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="Todas las categorías" value="" />
          <Picker.Item label="Emergencias Locales" value="Emergencias Locales" />
          <Picker.Item label="Educación Local" value="Educación Local" />
          <Picker.Item label="Donaciones Monetarias" value="Donaciones Monetarias" />
        </Picker>
      </View>

      <FlatList
        data={filteredCampaigns}
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
  filters: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  picker: {
    height: 55,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
