import { useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';

export const useAlert = () => {
  const successAlert = useCallback((message: string, action?: string, duration: number = 1500) => {
    return toast.success(message, {
      autoClose: duration,
      position: "bottom-center",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const errorAlert = useCallback((message: string, action?: string, duration: number = 0) => {
    return toast.error(message, {
      autoClose: duration,
      position: "bottom-center",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const infoAlert = useCallback((message: string, action?: string) => {
    return toast.info(message, {
      position: "bottom-center",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const closeAlert = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    successAlert,
    errorAlert,
    infoAlert,
    closeAlert
  };
};