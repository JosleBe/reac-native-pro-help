import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CampaignHistoryDonation from '../../screens/CampaignRecordDonation';
import CampaignHistoryBeneficiary from '../../screens/CampaignRecordBeneficiary';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Colors from '../../../../utils/Colors';

const Tab = createMaterialTopTabNavigator();

const TabNavigatorHistory = ({ donations, beneficiaries }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  return (
    <Tab.Navigator
    initialRouteName={`Donaciones ${donations.length}`}
      screenOptions={{
        lazy: false, // Asegura que todos los tabs se carguen al inicio
        tabBarScrollEnabled: true,
        tabBarActiveTintColor: Colors.brown, 
        tabBarInactiveTintColor: '#6b7280', 
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 14,
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.brown,
          height: 3,
          borderRadius: 10,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        },
        tabBarItemStyle: {
          width: width / 2, 
        },
      }}
    >
      <Tab.Screen 
        name={`Donaciones ${donations.length}`} 
        component={CampaignHistoryDonation}
        initialParams={{ donations }}
      
      />
      <Tab.Screen 
        name={`Beneficiarios ${beneficiaries.length}`}
        component={CampaignHistoryBeneficiary}
        initialParams={{ beneficiaries }}
     
      />
    </Tab.Navigator>
  );
};

export default TabNavigatorHistory;
