import axios from 'axios';

class DonationService  {
    static BASE_URL = "http://192.168.100.184:8080/api/pre-donation"
    static BASE_URL2 = "http://192.168.100.184:8080/api/campaign"
    static BASE_URL3 = "http://192.168.100.184:8080/api/donations"

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
}

export default DonationService;