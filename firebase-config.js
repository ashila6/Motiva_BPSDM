const firebaseConfig = {
    apiKey: "AIzaSyCYJi5-N7qPrEF5Vvdba5rYmsGk_MchfZk",
    authDomain: "motiva-bpsdm.firebaseapp.com",
    projectId: "motiva-bpsdm",
    storageBucket: "motiva-bpsdm.firebasestorage.app",
    messagingSenderId: "991982447092",
    appId: "1:991982447092:web:f9164929a3ae19430031a1"
};

// 🔥 FIREBASE v10
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';

import {
    getFirestore,
    collection,
    addDoc,
    doc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// 🔥 INIT APP
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// 🔥 TASKS GLOBAL
export let tasks = [];

let unsubscribeTasks = null;

// 🔥 REALTIME TASKS
export function setupRealtimeTasks(callback) {

    if (unsubscribeTasks) {
        unsubscribeTasks();
    }

    const q = query(
        collection(db, "tasks"),
        orderBy("createdAt", "desc")
    );

    unsubscribeTasks = onSnapshot(q, (snapshot) => {

        // 🔥 CLEAR ARRAY TANPA REASSIGN
        tasks.length = 0;

        snapshot.forEach((docSnap) => {

            tasks.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });
        window.tasks = tasks;
        console.log("🔥 Firebase Sync:", tasks.length);

        // 🔥 UPDATE GLOBAL WINDOW
        window.tasks = tasks;

        if (callback) {
            callback();
        }

    }, (error) => {

        console.error("❌ Firebase realtime error:", error);

    });
}

// 🔥 SAVE TASK
export async function saveTask(newTask) {

    try {

        await addDoc(collection(db, "tasks"), {
            ...newTask,
            createdAt: serverTimestamp()
        });

        console.log("✅ Task berhasil disimpan");

        return true;

    } catch (error) {

        console.error("❌ Save Error:", error);

        alert("Gagal menyimpan tugas: " + error.message);

        return false;
    }
}

// 🔥 UPDATE STATUS
export async function updateStatus(taskId, status) {

    try {

        const taskRef = doc(db, "tasks", taskId);

        await updateDoc(taskRef, {
            status: status
        });

        console.log("✅ Status updated");

    } catch (error) {

        console.error("❌ Update status error:", error);

        alert("Gagal update status");
    }
}

export async function deleteTaskFirebase(taskId) {

    try {

        await deleteDoc(doc(db, "tasks", taskId));

        console.log("🗑 Task berhasil dihapus");

    } catch (error) {

        console.error("Gagal hapus:", error);

    }
}
