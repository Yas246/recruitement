import { UserRole } from "@/firebase/types";

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  userType?: UserRole;
}
