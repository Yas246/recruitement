import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  UploadMetadata,
  UploadResult,
} from "firebase/storage";
import { storage } from "./config";

// Service de stockage Firebase
export const storageService = {
  // Téléverser un fichier
  uploadFile: async (
    filePath: string,
    file: File,
    metadata?: UploadMetadata
  ): Promise<string> => {
    try {
      const storageRef = ref(storage, filePath);
      const result: UploadResult = await uploadBytes(
        storageRef,
        file,
        metadata
      );
      const downloadURL = await getDownloadURL(result.ref);
      return downloadURL;
    } catch (error) {
      console.error("Erreur lors du téléversement du fichier:", error);
      throw error;
    }
  },

  // Obtenir l'URL de téléchargement d'un fichier
  getFileUrl: async (filePath: string): Promise<string> => {
    try {
      const storageRef = ref(storage, filePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'URL du fichier:",
        error
      );
      throw error;
    }
  },

  // Supprimer un fichier
  deleteFile: async (filePath: string): Promise<void> => {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
      throw error;
    }
  },

  // Lister tous les fichiers dans un dossier
  listFiles: async (
    folderPath: string
  ): Promise<{ name: string; url: string }[]> => {
    try {
      const folderRef = ref(storage, folderPath);
      const fileList = await listAll(folderRef);

      const filesWithUrls = await Promise.all(
        fileList.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            url,
          };
        })
      );

      return filesWithUrls;
    } catch (error) {
      console.error("Erreur lors de la liste des fichiers:", error);
      throw error;
    }
  },

  // Générer un chemin de fichier pour un utilisateur
  generateFilePath: (
    userId: string,
    fileName: string,
    folder = "documents"
  ): string => {
    // Ajouter un horodatage pour éviter les doublons
    const timestamp = new Date().getTime();
    // Assainir le nom de fichier (remplacer les espaces et caractères spéciaux)
    const sanitizedFilename = fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    return `users/${userId}/${folder}/${timestamp}_${sanitizedFilename}`;
  },
};
