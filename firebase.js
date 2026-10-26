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

const COLLECTION =
    "repairs";

// ======================================
// AUTH
// ======================================

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
// READ ONE
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

    if(!snapshot.exists()){

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
