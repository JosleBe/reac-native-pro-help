import axios from 'axios';
import {API_URL, PORT} from '@env'
class DonationService  {
    static BASE_URL = API_URL + ":" + PORT + "/api/pre-donation"
    static BASE_URL2 = API_URL + ":" + PORT + "/api/campaign"
    static BASE_URL3 = API_URL + ":" + PORT+ "/api/donations"

    static async getPrDonations(token) {
        const response = await axios.get(`${this.BASE_URL}/pending`,
            {
                headers:  {
                    Authorization: `Bearer ${token}` 
                }
            }
        )
        console.log("Respuesta", response)

        return response.data;
    }

    static async getCampaignById(campaignId, token) {
        const response = await axios.get(`${this.BASE_URL2}/campaign/${campaignId}`,
            {
                headers:  {
                    Authorization: `Bearer ${token}` 
                }
            }
        )

        return response.data;
    }

    static async acceptDonation(donation, token) {
        console.log("donation", donation);
        
        const body = {
          campaignId: donation.campaignId,
          donorId: donation.donorId,
          amount: donation.amount || 0,
          email: donation.email,
          phone: donation.phone,
          name: donation.name,
          donaciones: donation.object.articulos
        };
    
        try {
          const response = await axios.post(
            `${this.BASE_URL3}/insumo`,
            body,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
    
          return response.data;
        } catch (error) {
          console.error("Error en acceptDonation:", error.response?.data || error.message);
          throw error;
        }
      }
      static async deletePreDonationById(id, token) {
        try {
          const response = await axios.delete(`${this.BASE_URL}/deleteById/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return response.data;
        } catch (error) {
          console.error("Error eliminando pre-donación:", error.response?.data || error.message);
          throw error;
        }
      }

      static async getDonationsByCampaignId(campaignId, token) {
        const response = await axios.get(`${this.BASE_URL3}/campaign/${campaignId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      }

      static async getDonationsbyInsumoId(campaignId, token) {
        const response = await axios.get(`${this.BASE_URL3}/total-insumos/${campaignId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      }
}

export default DonationService;