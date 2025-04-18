import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/Navigation/AppNavigator';

import usePayPalDeepLinkHandler from './src/Kernel/hooks/usePayPalDeepLinkHandler ';

export default function App() {
  

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

