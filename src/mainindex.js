import "./threejs.js"
import { initializeApp } from "firebase/app";
import {
  collection, getFirestore,
  onSnapshot, addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc,updateDoc,ref
} from "firebase/firestore";
import { getAuth,createUserWithEmailAndPassword,
signOut, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,onAuthStateChanged } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider} from "firebase/app-check";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAn1UjOa1iY6Ccl9qLdw8_FgQRcyVv9Jk0",
    authDomain: "chat-1e6d7.firebaseapp.com",
    databaseURL: "https://chat-1e6d7-default-rtdb.firebaseio.com",
    projectId: "chat-1e6d7",
    storageBucket: "chat-1e6d7.appspot.com",
    messagingSenderId: "961906672353",
    appId: "1:961906672353:web:50b7a5cf19ee59bc396da0",
    measurementId: "G-RCM5PT2V92"
  };
  console.log("WHATA FAACK")
  
//init firebase app
const app = initializeApp(firebaseConfig);

//init services
const db = getFirestore(app);
const auth = getAuth(app);
var userInitials = "";

//collection ref
const colRef = collection(db, "messages");

//queries
const q = query(colRef, orderBy("createdAt"));

//get  real timecollection data
onSnapshot(q, (snapshot) => {
    let msgs = [];
    let innerT = ""
    snapshot.docs.forEach((doc) => {
      msgs.push({ ...doc.data(), id: doc.id })
      let usName = doc.data().username
      let text = doc.data().msgText
      let time =  new Date(doc.data().createdAt.seconds*1000) 
      time = time.toLocaleString();
      console.log(time)
       const message = `<li class=${
         userInitials == usName ? "sent" : "receive"
       }><span>${usName } : </span>${text} <br><br>${time}</li>`;
       // append the message on the page
       innerT += message
      
      
    })
    document.getElementById("messages").innerHTML = innerT
    console.log(userInitials);
  })


// adding messages
const addMessageForm = document.querySelector('.message-form')
addMessageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    username: userInitials,
    msgText: addMessageForm.msgText.value,
    createdAt: serverTimestamp()
  })
    .then(() => {
      addMessageForm.reset()
    })
})

const provider = new GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
// provider.setCustomParameters({
//   'login_hint': 'user@example.com'
// });
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()
  //console.log("FUCK")
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    userInitials = user.displayName;

    document.querySelector(".chatSpace").style.display = "block";
    signupForm.style.display = "none";
  
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  
})
