import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../../Kernel/config/firebase-config';

const BASE_URL = `${API_URL}/api`;

const AdminService = {
  getAllAdmins: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/adminuser/all-admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener admins:', error);
      throw error;
    }
  },

  getAllCampaigns: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/campaign`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener las campañas:', error);
      throw error;
    }
  },

  handleSubmit: async (texto, image, campaignId, setText, setImage) => {
    if (!texto.trim()) return;

    const imagen = await AdminService.handleUpload(image);

    const token = await AsyncStorage.getItem('token');
    const profile = JSON.parse(await AsyncStorage.getItem('profileInfo'));
    console.log("Profile", profile)
    const name = profile?.user?.name;
    const comment = { autor: name, texto, imagen };

    await axios.post(
      `${BASE_URL}/campaign/${campaignId}/comments`,
      comment,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setText('');
    setImage(null);
  },

  handleUpload: async (image) => {
    if (!image) return null;

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'upload.jpg',
      type: image.type || 'image/jpeg',
    });

    try {
      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl; // Asegúrate que esta ruta sea correcta en el backend
    } catch (error) {
      console.error('Error al subir imagen:', error);
      return null;
    }
  },

  handlePrivate: async (newMessage, email, admins, getChatId, setNewMessage, setShowModal) => {
    if (newMessage.trim() === '' || admins.length === 0) return;

    try {
      for (const admin of admins) {
        const chatId = getChatId(email, admin.email);

        const message = {
          text: newMessage,
          sender: email,
          recipient: admin.email,
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, `chats/${chatId}/messages`), message);

        await axios.post(`${BASE_URL}/send`, {
          emisorEmail: email,
          receptorEmail: admin.email,
          texto: newMessage,
        });
      }

      setNewMessage('');
      setShowModal(false);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  },

  getChatId: (userEmail, recipientEmail) => {
    return userEmail < recipientEmail
      ? `${userEmail}_to_${recipientEmail}`
      : `${recipientEmail}_to_${userEmail}`;
  },

  changeStatusCampaign: async (campaignId, status) => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.patch(`${BASE_URL}/campaign/${campaignId}/status/${!status}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
   if (response.status === 200) {
    return {status: 'success'};
  }
  return {status: 'error'};
  },
};

export default AdminService;
