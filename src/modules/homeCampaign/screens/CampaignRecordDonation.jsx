import React, { useState, useCallback } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).replace(',', '');
};

const CampaignHistoryDonation = ({ route }) => {
  const donations = route?.params?.donations;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDonations, setCurrentDonations] = useState(donations || []);
  const [loading, setLoading] = useState(true);
  // 🔁 Al enfocar el tab, actualizar donaciones y limpiar búsqueda
  useFocusEffect(
    useCallback(() => {
      setCurrentDonations(donations || []);
      setSearchTerm('');
    }, [donations])
  );

  const filteredDonations = currentDonations.filter(d =>
    d.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input
        inputContainerStyle={styles.searchInput}
        placeholder="Buscar por correo..."
        placeholderTextColor="#999"
        value={searchTerm}
        onChangeText={setSearchTerm}
        rightIcon={<Icon name="search1" type="antdesign" size={20} color="#999" />}
      />

      {filteredDonations.length > 0 ? (
        filteredDonations.map((donation, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.item}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{donation.name}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Monto</Text>
                <Text style={styles.value}>${donation.amount.toLocaleString()}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Fecha</Text>
                <Text style={styles.value}>{formatDate(donation.donationDate)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.item}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{donation.email}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>{donation.phone}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noResults}>No se encontraron donaciones.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    minWidth: '45%',
    marginRight: 11,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '700',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  noResults: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },
});

export default CampaignHistoryDonation;
