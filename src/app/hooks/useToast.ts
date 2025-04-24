import toast, { ToastOptions } from "react-hot-toast";

interface UseToastReturn {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  custom: (message: string, options?: ToastOptions) => string;
  loading: (message: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: ToastOptions
  ) => Promise<T>;
}

export function useToast(): UseToastReturn {
  const success = (message: string, options?: ToastOptions): string => {
    return toast.success(message, options);
  };

  const error = (message: string, options?: ToastOptions): string => {
    return toast.error(message, options);
  };

  const info = (message: string, options?: ToastOptions): string => {
    return toast(message, {
      icon: "ℹ️",
      ...options,
    });
  };

  const warning = (message: string, options?: ToastOptions): string => {
    return toast(message, {
      icon: "⚠️",
      style: {
        borderColor: "#f59e0b",
      },
      ...options,
    });
  };

  const custom = (message: string, options?: ToastOptions): string => {
    return toast(message, options);
  };

  const loading = (message: string, options?: ToastOptions): string => {
    return toast.loading(message, options);
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const promise = <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: ToastOptions
  ): Promise<T> => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      options
    );
  };

  return {
    success,
    error,
    info,
    warning,
    custom,
    loading,
    dismiss,
    promise,
  };
}
