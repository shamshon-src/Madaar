// Firebase Web App settings are public client identifiers, not server credentials.
// Add the Web API key here later. Never add a Service Account private key here.
window.MadaarFirebaseConfig = {
  mode: 'firebase',
  firebase: {
    apiKey: 'AIzaSyBxAwYTRn1__z7e-c1MF3M98D9lJ_WJBDw',
    authDomain: 'madaar-web-game.firebaseapp.com',
    databaseURL: 'https://madaar-web-game-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'madaar-web-game',
    storageBucket: 'madaar-web-game.firebasestorage.app',
    messagingSenderId: '894231145240',
    appId: '1:894231145240:web:5e1a053f636dc5e7074c6d'
  },
  // Set this to the HTTPS address of the separate room server before publishing.
  onlineApiBaseUrl: 'http://127.0.0.1:5700/api/online',
  // Real Firebase identity and the separate local Firebase-backed room server.
  onlineMode: 'firebase'
};
