export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  userType?: "student" | "worker" | "artist";
}
