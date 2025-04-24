import {
  DocumentData,
  Query,
  QueryConstraint,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { firebaseApp } from "./config";

// Type générique pour les opérations Firestore
export interface FirestoreDocument {
  id?: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Date
    | Timestamp
    | Array<unknown>
    | Record<string, unknown>;
}

// Types pour les filtres et tris
export interface WhereFilter {
  fieldPath: string;
  opStr:
    | "<"
    | "<="
    | "=="
    | "!="
    | ">="
    | ">"
    | "array-contains"
    | "array-contains-any"
    | "in"
    | "not-in";
  value:
    | string
    | number
    | boolean
    | null
    | Date
    | Timestamp
    | Array<unknown>
    | Record<string, unknown>;
}

export interface OrderByOption {
  fieldPath: string;
  direction: "asc" | "desc";
}

// Service Firestore
export const firestoreService = {
  // Créer un document avec un ID personnalisé
  createDocument: async <T extends FirestoreDocument>(
    collectionName: string,
    documentId: string,
    data: T
  ): Promise<void> => {
    try {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        `Erreur lors de la création du document ${documentId} dans ${collectionName}:`,
        error
      );
      throw error;
    }
  },

  // Créer un document avec un ID généré automatiquement
  addDocument: async <T extends FirestoreDocument>(
    collectionName: string,
    data: T
  ): Promise<string> => {
    try {
      const db = getFirestore(firebaseApp);
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error(
        `Erreur lors de l'ajout d'un document dans ${collectionName}:`,
        error
      );
      throw error;
    }
  },

  // Obtenir un document par son ID
  getDocument: async <T extends FirestoreDocument>(
    collectionName: string,
    documentId: string
  ): Promise<T | null> => {
    try {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as T;
      }
      return null;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du document ${documentId} dans ${collectionName}:`,
        error
      );
      throw error;
    }
  },

  // Mettre à jour un document existant
  updateDocument: async <T extends FirestoreDocument>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
  ): Promise<void> => {
    try {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du document ${documentId} dans ${collectionName}:`,
        error
      );
      throw error;
    }
  },

  // Supprimer un document
  deleteDocument: async (
    collectionName: string,
    documentId: string
  ): Promise<void> => {
    try {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(
        `Erreur lors de la suppression du document ${documentId} dans ${collectionName}:`,
        error
      );
      throw error;
    }
  },

  // Obtenir tous les documents d'une collection
  getAllDocuments: async <T extends FirestoreDocument>(
    collectionName: string
  ): Promise<T[]> => {
    try {
      const db = getFirestore(firebaseApp);
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des documents de ${collectionName}:`,
        error
      );
      throw error;
    }
  },

  // Requête avec filtres (pagination, tri, etc.)
  queryDocuments: async <T extends FirestoreDocument>(
    collectionName: string,
    queryConstraints: QueryConstraint[] = [],
    lastDoc?: DocumentData
  ): Promise<T[]> => {
    try {
      const db = getFirestore(firebaseApp);
      let baseQuery = query(
        collection(db, collectionName),
        ...queryConstraints
      );
      if (lastDoc) {
        baseQuery = query(baseQuery, startAfter(lastDoc));
      }
      const snapshot = await getDocs(baseQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error(
        `Erreur lors de la requête des documents de ${collectionName}:`,
        error
      );
      throw error;
    }
  },

  // Obtenir un query builder pour une collection
  getQueryBuilder: (collectionName: string): Query<DocumentData> => {
    const db = getFirestore(firebaseApp);
    return query(collection(db, collectionName));
  },

  // Exécuter une requête personnalisée
  getDocumentsWithQuery: async <T extends FirestoreDocument>(
    query: Query<DocumentData>
  ): Promise<T[]> => {
    try {
      const snapshot = await getDocs(query);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
    } catch (error) {
      console.error("Erreur lors de l'exécution de la requête:", error);
      throw error;
    }
  },
};
