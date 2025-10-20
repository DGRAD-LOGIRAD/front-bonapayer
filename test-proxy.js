// Script de test pour vérifier la configuration du proxy
const axios = require('axios');

async function testProxy() {
  console.log('🧪 Test de la configuration du proxy Vite...\n');

  const baseURL = 'http://localhost:5173'; // URL du serveur de dev Vite

  try {
    console.log("📡 Test de l'endpoint /ms-bp/reg/api/v1/bon-a-payer...");

    const response = await axios.post(
      `${baseURL}/ms-bp/reg/api/v1/bon-a-payer`,
      {
        pagination: {
          pageSize: 10,
          page: 1,
        },
        filters: {
          contribuableNif: '*',
          contribuableName: '*',
          reference_bon_a_payer_logirad: '*',
        },
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Succès !');
    console.log('📊 Status:', response.status);
    console.log('📋 Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Erreur:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log(
        "Erreur réseau - Le serveur de dev n'est peut-être pas démarré"
      );
      console.log('Démarrez le serveur avec: npm run dev');
    } else {
      console.log('Erreur:', error.message);
    }
  }
}

testProxy();
