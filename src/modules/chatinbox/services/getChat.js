import axios from "axios";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
class ChatInbox {
    static BASE_URL = "http://192.168.100.184:8080/api"

    static async getContacts(email) {
        try {
            const response = await axios.get(`${this.BASE_URL}/${email}/contacts`);
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
        const chatId = getChatId(email, contactEmail.email );
        const q = query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
      
            return messagesArray;
          });
    }


    static  getChatId = (userEmail, recipientEmail) => {
        return userEmail < recipientEmail
          ? `${userEmail}_to_${recipientEmail}`
          : `${recipientEmail}_to_${userEmail}`;
      };



}