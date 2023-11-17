import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyCfbzNxctiUbwJYSRicmoYmRYhNU085tV4",
  authDomain: "whatsapp-store-c7058.firebaseapp.com",
  projectId: "whatsapp-store-c7058",
  storageBucket: "whatsapp-store-c7058.appspot.com",
  messagingSenderId: "669578259172",
  appId: "1:669578259172:web:860cffb22b1143d61c5af1",
  measurementId: "G-K7WBJGP3SN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signUpWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      const email = result.user.email;
      const profilePic = result.user.photoURL;
      const name = result.user.displayName.toLocaleLowerCase();
      const domain = result.user.displayName.split(" ")[0].toLocaleLowerCase();
      const password = result.user.uid;



      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("domain", domain);
      localStorage.setItem("password", password);

      // Call the API using axios
      let data = JSON.stringify({
        username: domain,
        password: password,
        email: email,
        subdomain: domain,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:4500/api/users",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      // window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      const email = result.user.email;
      const profilePic = result.user.photoURL;
      const name = result.user.displayName.toLocaleLowerCase();
      const domain = result.user.displayName.split(" ")[0].toLocaleLowerCase();
      const password = result.user.uid;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("domain", domain);
      localStorage.setItem("password", password);

      let data = JSON.stringify({
        password: password,
        email: email,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:4500/api/users/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          console.log("this is jwt " + response.data.jwt);
          localStorage.setItem("jwt", response.data.jwt);
          // window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          window.location.reload();
        });

      // window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const signOut = () => {
  // Clear data from local storage
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("profilePic");
  localStorage.removeItem("password");
  localStorage.removeItem("domain");
  localStorage.removeItem("jwt");

  window.location.reload();
};
