import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

class UserService {
    static BASE_URL = "http://192.168.0.94:8080"

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/api/auth/login`, { email, password })
            return response.data;

        } catch (err) {
            throw err;
        }
    }

    static async register(userData, token) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                })
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


    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin() {
        const role = localStorage.getItem('role')

        return role === 'ADMIN'
    }

    static isUser() {
        const role = localStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }

    static async getToken() {
        const token = await AsyncStorage.getItem('token')
        return token;
    }

}

export default UserService;