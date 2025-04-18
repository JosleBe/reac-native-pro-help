import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, PORT } from '@env';

const useComments = (campaignId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setLoading(true);
      const response = await axios.get(`${API_URL}:${PORT}/api/campaign/${campaignId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchComments();
    const interval = setInterval(() => {
      fetchComments();
    }, 10000); 

    return () => clearInterval(interval);
  }, [campaignId]);

  return { comments, loading };
};

export default useComments;
