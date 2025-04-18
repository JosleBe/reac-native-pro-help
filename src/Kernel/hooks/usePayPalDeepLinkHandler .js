import { useEffect } from 'react';
import { Linking } from 'react-native';
import PayIt from '../../modules/homeCampaign/service/PayIt'; // Ajusta la ruta

const usePayPalDeepLinkHandler = () => {
  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      const parsed = Linking.parse(url);
      
      if (parsed.scheme === 'myapp' && parsed.path === 'campaigns') {
        const { status, transactionId, idCampana, idUsuario } = parsed.queryParams;

        if (status === 'success' && transactionId) {
            PayIt.capturePayment(transactionId);
        } else if (status === 'canceled') {
          console.log("Pago cancelado por el usuario");
        }
      }
    };

    // Escuchar los enlaces entrantes
    Linking.addEventListener('url', handleDeepLink);

    // Comprobar si la app se abrió por un enlace
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => Linking.removeEventListener('url', handleDeepLink);
  }, []);
};

export default usePayPalDeepLinkHandler;
