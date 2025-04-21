import { API_URL } from '@env';
import axios from 'axios';
const BASE_URL = `${API_URL}/api/donations`;
const BASE_URL_ADMINUSER = `${API_URL}/api/adminuser`;
const BASE_URL_ADMIN = `${API_URL}/api/admin`;
const UsersService = {



    getUsers: async (userId, token) => {
        try {
            const response = await axios.get(`${BASE_URL}/donor/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            return response.data.length;
        } catch (error) {
            console.error('Error al obtener las donaciones', error);
            return 0;
        }
    },

    getUserAllUsers: async (token, loggedInUserId) => {
        try {
            const response = await axios.get(`${BASE_URL_ADMINUSER}/get-all-users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            const activeUsers = response.data.userEntityList.filter(user => user.active && user.email !== loggedInUserId);

            return activeUsers;
        } catch {
            console.error('Error al obtener los usuarios', error);
        }
    },
    disableUser: async (token, userId) => {
        try {
            const response = await axios.patch(`${BASE_URL_ADMIN}/disable-user/${userId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            return response.status;
        } catch (error) {
            console.error('Error al deshabilitar el usuario', error);
        }
    }
}

export default UsersService;