import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TabNavigatorHistory from '../navigation/tabs/TabNavigatorHistory'
import Colors from '../../../utils/Colors'
import DonationService from '../../donations/services/DonationService'
import UserService from '../../auth/service/AuthService'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
const HistoryCampaign = ({ route }) => {
    const { campaign, navigation } = route.params;
    const [donations, setDonations] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);  // Estado de carga
  
    useFocusEffect(
      useCallback(() => {
        getData();
      }, [])
    );
  
    const getData = async () => {
      const token = await UserService.getToken();
      try {
        setLoading(true);  
        const response = await DonationService.getDonationsByCampaignId(campaign.id, token);
        if (response) {
          setDonations(response);
          const beneficiaries = await DonationService.getBeneficiariesByCampaignId(campaign.id, token);
          setBeneficiaries(beneficiaries);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);  
      }
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" type="antdesign" size={20} color="black" />
          </TouchableOpacity>
          <Text numberOfLines={3} style={styles.title}>{campaign.nombre}</Text>
        </View>
  
        {/* Si los datos están cargando, muestra el indicador de carga */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.brown} />
          
          </View>
        ) : (
          <TabNavigatorHistory donations={donations} beneficiaries={beneficiaries} />
        )}
      </SafeAreaView>
    );
  };
  


const styles = StyleSheet.create({
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginVertical: 20,
        maxHeight: 70,
        backgroundColor: Colors.cielo,
        textAlign: 'center',
        width: '80%',
        borderRadius: 10,
        padding: 10,
    },
    dataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',

        marginVertical: 20
    },
    item: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black,
        backgroundColor: Colors.cielo,
        padding: 10,
        borderRadius: 10,
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        width: 40,
        height: 40,
    }



})
export default HistoryCampaign
