import axios from 'axios';
import {PORT_PAYPAL} from '@env'
import {API_URL} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = `${API_URL}:${PORT_PAYPAL}`;
const donationService = {
    payTo: async (pago, onApprovalUrlReady) => {
        try {
            const response = await axios.post(`${BASE_URL}/create-order`, pago);
            console.log("Respuesta de la orden:", response.data);
    
            if (response.data.status === 'CREATED' && response.data.links) {
                const approvalUrl = response.data.links.find(link => link.rel === "approve")?.href;
                if (approvalUrl) {
                    onApprovalUrlReady(approvalUrl); // <--- ahora lo manejamos en la app
                } else {
                    console.error("No se encontró un link de aprobación en la respuesta.");
                }
            } else {
                console.error("La orden no fue creada correctamente.");
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error.response?.data || error.message);
        }
    },

    capturePayment: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/capture-order?token=${token}`, {
                headers: {
                    'X-Client': 'mobile'
                  }
            });
            const transactionData = response.data;
            console.log("Transaction Data:", transactionData);

            if (transactionData.status === 'success') {
                return transactionData;
            } else {
                console.error("Transacción no completada");
            }
        } catch (error) {
            console.error("Error al capturar el pago:", error);
        }
    },
    

    fetchTransactionDetails: async (transactionId) => {
        if (transactionId) {
            try {
                const response = await axios.get(`${BASE_URL}/transaction/${transactionId}`);
                return response.data;
            } catch (error) {
                console.error("Error obteniendo los detalles de la transacción:", error);
            }
        }
    },

    registerDonation: async (payload) => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await axios.post(`${API_URL}/api/donations`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("Donación registrada:", response.data);
        } catch (error) {
            console.error("Error registrando la donación:", error);
        }
    },
};

export default donationService;
