import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Icon } from 'react-native-elements';

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

const CampaignHistoryBeneficiary = ({ route }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [beneficiariesLoaded, setBeneficiariesLoaded] = useState(false);

  const beneficiaries = route?.params?.beneficiaries;


  const filtered = beneficiaries?.filter(b =>
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input
        inputContainerStyle={styles.searchInput}
        placeholder="Buscar por nombre o correo..."
        placeholderTextColor="#999"
        value={searchTerm}
        onChangeText={setSearchTerm}
        rightIcon={<Icon name="search1" type="antdesign" size={20} color="#999" />}
      />

      {filtered?.length > 0 ? (
        filtered.map((beneficiary, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.item}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{beneficiary.name}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Correo</Text>
                <Text style={styles.value}>{beneficiary.email || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.item}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>{beneficiary.phone || 'N/A'}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Fecha de Entrega</Text>
                <Text style={styles.value}>{formatDate(beneficiary.joinDate)}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noResults}>No se encontraron beneficiarios.</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default CampaignHistoryBeneficiary;
