import axios from "axios";
import { API_URL } from '@env';

class ProfileService {
    static BASE_URL = `${API_URL}/api`;

    /**
     * Cambiar contraseña del usuario
     * @param {Object} data - Contiene email, contraseña actual y nueva contraseña.
     * @param {string} token - El token de autenticación del usuario.
     * @returns {Promise}
     */
    static async changePassword(data, token) {
        try {
            const response = await axios.put(
                `${this.BASE_URL}/change-password`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Añadir token en los encabezados
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error en cambio de contraseña:", error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Actualizar la información del usuario
     * @param {string} id - El ID del usuario a actualizar.
     * @param {Object} data - Contiene la nueva información del usuario (nombre, correo, etc.).
     * @param {string} token - El token de autenticación del usuario.
     * @returns {Promise}
     */
    static async updateUser(id, data, token) {
        try {
            const response = await axios.put(
                `${this.BASE_URL}/admin/update/${id}`, // Endpoint que se utilizará para actualizar
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Añadir token en los encabezados
                    }
                }
            );
            return response.data; // Aquí recibes la respuesta de la API (usuario actualizado)
        } catch (error) {
            console.error("Error al actualizar el usuario:", error.response?.data || error.message);
            throw error;
        }
    }

}

export default ProfileService;
