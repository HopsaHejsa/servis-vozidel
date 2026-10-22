// ======================================
// FIREBASE
// ======================================

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


// ======================================
// FIREBASE CONFIG
// ======================================

const firebaseConfig = {

    apiKey: "AIzaSyAoZMfqHSa7m4CDLZx7qI3jIHHqN_wt22M",

    authDomain: "servis-vozidel.firebaseapp.com",

    projectId: "servis-vozidel",

    storageBucket: "servis-vozidel.firebasestorage.app",

    messagingSenderId: "412797269483",

    appId: "1:412797269483:web:9a4535b2f2635c1ea615ae"

};


// ======================================
// INIT
// ======================================

const app =
    initializeApp(
        firebaseConfig
    );

export const auth =
    getAuth(app);

export const db =
    getFirestore(app);


// ======================================
// AUTH
// ======================================

export async function login(
    email,
    password
){

    return await
    signInWithEmailAndPassword(
        auth,
        email,
        password
    );

}

export async function logout(){

    return await
    signOut(auth);

}

export function watchAuth(
    callback
){

    return onAuthStateChanged(
        auth,
        callback
    );

}


// ======================================
// REPAIRS
// ======================================

const COLLECTION =
    "repairs";


// ======================================
// CREATE
// ======================================

export async function createRepair(
    repair
){

    return await addDoc(

        collection(
            db,
            COLLECTION
        ),

        repair

    );

}


// ======================================
// LOAD ALL
// ======================================

export async function getRepairs(){

    const snapshot =
        await getDocs(

            collection(
                db,
                COLLECTION
            )

        );

    return snapshot.docs.map(
        item => ({

            id:item.id,

            ...item.data()

        })
    );

}


// ======================================
// LOAD ONE
// ======================================

export async function getRepair(
    id
){

    const snapshot =
        await getDoc(

            doc(
                db,
                COLLECTION,
                id
            )

        );

    if(
        !snapshot.exists()
    ){

        return null;

    }

    return {

        id:snapshot.id,

        ...snapshot.data()

    };

}


// ======================================
// UPDATE
// ======================================

export async function updateRepair(
    id,
    repair
){

    await updateDoc(

        doc(
            db,
            COLLECTION,
            id
        ),

        repair

    );

}


// ======================================
// DELETE
// ======================================

export async function deleteRepair(
    id
){

    await deleteDoc(

        doc(
            db,
            COLLECTION,
            id
        )

    );

}


// ======================================
// ARCHIVE
// ======================================

export async function archiveRepair(
    id
){

    await updateDoc(

        doc(
            db,
            COLLECTION,
            id
        ),

        {
            archiv:true
        }

    );

}


// ======================================
// DONE
// ======================================

export async function markRepairDone(
    id
){

    await updateDoc(

        doc(
            db,
            COLLECTION,
            id
        ),

        {
            stav:"Hotovo"
        }

    );

}


// ======================================
// HISTORY BY SPZ
// ======================================

export async function getVehicleHistory(
    spz
){

    const q =
        query(

            collection(
                db,
                COLLECTION
            ),

            where(
                "spz",
                "==",
                spz
            )

        );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(
        item => ({

            id:item.id,

            ...item.data()

        })
    );

}


// ======================================
// LAST VEHICLE DATA
// ======================================

export async function getVehicleData(
    spz
){

    const history =
        await getVehicleHistory(
            spz
        );

    if(
        history.length === 0
    ){
        return null;
    }

    return history[0];

}


// ======================================
// REALTIME
// ======================================

export function watchRepairs(
    callback
){

    return onSnapshot(

        collection(
            db,
            COLLECTION
        ),

        snapshot => {

            const repairs =
            snapshot.docs.map(
                item => ({

                    id:item.id,

                    ...item.data()

                })
            );

            callback(
                repairs
            );

        }

    );

}