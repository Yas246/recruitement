import { FirebaseError, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

interface AdminUser {
  email: string;
  password: string;
  displayName: string;
}

const createAdminUser = async ({ email, password, displayName }: AdminUser) => {
  try {
    console.log("Tentative de création du compte administrateur...");
    console.log("Email:", email);

    // 1. Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("✅ Utilisateur créé dans Firebase Auth");

    // 2. Créer le profil administrateur dans Firestore (collection users)
    await setDoc(doc(firestore, "users", user.uid), {
      id: user.uid,
      email,
      displayName,
      firstName: displayName.split(" ")[0] || displayName,
      lastName: displayName.split(" ")[1] || "",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
    });
    console.log("✅ Profil utilisateur créé dans la collection 'users'");

    // 3. Créer le profil administrateur dans Firestore (collection admins)
    await setDoc(doc(firestore, "admins", user.uid), {
      id: user.uid,
      email,
      displayName,
      role: "admin",
      createdAt: new Date(),
      permissions: {
        canManageUsers: true,
        canManageApplications: true,
        canManageSettings: true,
      },
    });
    console.log("✅ Profil administrateur créé dans la collection 'admins'");

    console.log("✅ Compte administrateur créé avec succès");
    console.log("UID:", user.uid);
    console.log("Email:", email);
    console.log("Vous pouvez maintenant vous connecter avec ces identifiants");
  } catch (error: unknown) {
    console.error("❌ Erreur lors de la création du compte administrateur:");

    if (error instanceof FirebaseError) {
      // Gestion des erreurs spécifiques
      if (error.code === "auth/email-already-in-use") {
        console.error("L'adresse email est déjà utilisée par un autre compte");
        console.log("Si c'est votre compte, essayez de vous connecter avec");
      } else if (error.code === "auth/invalid-email") {
        console.error("L'adresse email n'est pas valide");
      } else if (error.code === "auth/weak-password") {
        console.error("Le mot de passe est trop faible (minimum 6 caractères)");
      } else {
        console.error(error.message);
      }
    } else {
      console.error("Une erreur inattendue s'est produite");
    }

    process.exit(1);
  }
};

// Récupérer les arguments de la ligne de commande
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error(
    "❌ Usage: npx ts-node src/scripts/createAdmin.ts <email> <password> <displayName>"
  );
  console.error(
    'Exemple: npx ts-node src/scripts/createAdmin.ts admin@example.com MotDePasse123! "Administrateur"'
  );
  process.exit(1);
}

const [email, password, displayName] = args;

// Exécuter le script avec les arguments
createAdminUser({ email, password, displayName });
