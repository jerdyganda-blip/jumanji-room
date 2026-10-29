const firebaseConfig = {
  apiKey: "AIzaSyCa5ymzdh_4-dsxVRnilOQ0SVhSVCe2sHk",
  authDomain: "jumanji-room.firebaseapp.com",
  databaseURL: "https://jumanji-room-default-rtdb.firebaseio.com/",
  projectId: "jumanji-room",
  storageBucket: "jumanji-room.firebasestorage.app",
  messagingSenderId: "910911385643",
  appId: "1:910911385643:web:964dd2828793192559fa6e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();