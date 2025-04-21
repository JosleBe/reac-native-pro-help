import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from '@env'

class UserService {
    static BASE_URL = API_URL

    static async login(email, password) {
        try {
            const url = `${UserService.BASE_URL}/api/auth/login`;
            console.log("URL de Login:", url);
            const response = await axios.post(url, { email, password });
            return response.data;
        } catch (err) {
            console.log("Error en la solicitud:", err.message);
            throw err;
        }
    }

    static async register(userData) {
        try {
            const url = `${UserService.BASE_URL}/api/auth/register`;
            console.log("URL de crear cuenta:", url);
            const response = await axios.post(url, userData);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getAllUsers(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }


    static async getYourProfile(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/api/adminuser/get-profile`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getUserById(userId, token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async deleteUser(userId, token) {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }


    static async updateUser(userId, userData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/api/admin/update/${userId}`, userData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getFirebaseToken(jwt, password) {
        const response = await fetch(`${UserService.BASE_URL}/api/auth/firebase-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ jwt, password }),
        });
        if (!response.ok) {
            throw new Error("Error fetching Firebase token.");
        }
        return response.json();
    }

    static async getAllAdmins(token) {
        try {
            const resonse = await axios.get(`${this.BASE_URL}/api/adminuser/all-admins`,
                {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
            return resonse.data;
        } catch (error) {
            throw error
        }

    }

    static async getAllCampaigns() {
        try {
            console.log("Obteniendo Campañas...")
            const response = await axios.get(`${this.BASE_URL}/api/campaign`);
            console.log("Campañas", response.data)
            return response.data.data;
        } catch (error) {
            console.log("Error al obtener campañas: ", error);
            throw error;
        }
    }

    /**AUTHENTICATION CHECKER */
    static logout() {
        AsyncStorage.removeItem('token')
        AsyncStorage.removeItem('profileInfo')
        AsyncStorage.removeItem('role')
    }

    static async isAuthenticated() {
        const token = await AsyncStorage.getItem('token')

        return token == null ? false : true
    }

    static async isAdmin() {
        const role = await AsyncStorage.getItem('role')
        return role === 'ADMIN'
    }

    static async isUser() {
        const role = await AsyncStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }

    static async getToken() {
        const token = await AsyncStorage.getItem('token')
        return token;
    }

    static async getProfileInSession() {
        const profile = await AsyncStorage.getItem('profileInfo');
        return JSON.parse(profile);
    }

}

export default UserService;