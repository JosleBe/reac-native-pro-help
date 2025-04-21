import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '@env';
import UserService from "../../auth/service/AuthService";

const useComments = (campaignId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await UserService.isAuthenticated();
      setIsAuthenticated(auth);
    };
    checkAuth();
  }, []);

  const fetchComments = async () => {
    if (!isAuthenticated || !campaignId) return;
    try {
      const token = await AsyncStorage.getItem("token");
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/campaign/${campaignId}/comments`, {
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
    if (!isAuthenticated || !campaignId) return;
    const interval = setInterval(fetchComments, 10000);
    return () => clearInterval(interval);
  }, [campaignId, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && campaignId) {
      fetchComments();
    }
  }, [isAuthenticated]);

  return { comments, loading };
};


export default useComments;
