import { useAuth } from "@/app/contexts/AuthContext";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

interface AdminPermissions extends Record<string, unknown> {
  canManageUsers: boolean;
  canManageApplications: boolean;
  canManageSettings: boolean;
}

interface AdminProfile extends FirestoreDocument {
  id: string;
  email: string;
  displayName: string;
  permissions: AdminPermissions;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<AdminPermissions | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.uid) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const adminProfile = await firestoreService.getDocument<AdminProfile>(
          "admins",
          user.uid
        );

        if (adminProfile) {
          setIsAdmin(true);
          setPermissions(adminProfile.permissions);
        } else {
          setIsAdmin(false);
          setPermissions(null);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        setPermissions(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.uid]);

  return {
    isAdmin,
    isLoading,
    permissions,
  };
}
