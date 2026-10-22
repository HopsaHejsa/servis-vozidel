import { initializeApp }
from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot
}
from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyAoZMfqHSa7m4CDLZx7qI3jIHHqN_wt22M",

    authDomain: "servis-vozidel.firebaseapp.com",

    projectId: "servis-vozidel",

    storageBucket: "servis-vozidel.firebasestorage.app",

    messagingSenderId: "412797269483",

    appId: "1:412797269483:web:9a4535b2f2635c1ea615ae"

};

const app =
    initializeApp(
        firebaseConfig
    );

export const auth =
    getAuth(app);

export const db =
    getFirestore(app);

export async function login(
    email,
    password
){

    return signInWithEmailAndPassword(
        auth,
        email,
        password
    );

}

export async function logout(){

    return signOut(auth);

}

export function watchAuth(
    callback
){

    return onAuthStateChanged(
        auth,
        callback
    );

}

const COLLECTION =
    "repairs";

export async function createRepair(
    repair
){

    console.log(
        "UKLADAM OPRAVU",
        repair
    );

    return await addDoc(

        collection(
            db,
            COLLECTION
        ),

        repair

    );

}

export function watchRepairs(
    callback
){

    return onSnapshot(

        collection(
            db,
            COLLECTION
        ),

        snapshot => {

            callback(

                snapshot.docs.map(
                    item => ({
                        id:item.id,
                        ...item.data()
                    })
                )

            );

        }

    );

}
