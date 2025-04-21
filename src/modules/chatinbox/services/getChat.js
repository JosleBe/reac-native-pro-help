import axios from "axios";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { API_URL } from '@env'
class ChatInbox {
    static BASE_URL = API_URL + "/api"

    static async getContacts(email) {
        const url = `${this.BASE_URL}/${email}/contacts`;
        console.log("📡 Llamando a:", url);

        try {
            const response = await axios.get(url);
            if (response.data) {
                return response.data;
            } else {
                throw new Error("No data found");
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
            throw error;
        }
    }

    static async unSubscribe(email, contactEmail) {
        const chatId = getChatId(email, contactEmail.email);
        const q = query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return messagesArray;
        });
    }


    static getChatId = (userEmail, recipientEmail) => {
        return userEmail < recipientEmail
            ? `${userEmail}_to_${recipientEmail}`
            : `${recipientEmail}_to_${userEmail}`;
    };



}
export default ChatInbox;