"use client";

import { toast, type ExternalToast } from "sonner";
import { getErrorMessage } from "./getErrorMessage";

type ToastMessage = Parameters<typeof toast>[0];

function createErrorOptions(options?: ExternalToast): ExternalToast {
  return {
    className: "!bg-red-600 !text-white !border-red-700",
    ...options,
  };
}

export const toastManager = {
  show: (message: ToastMessage, options?: ExternalToast) =>
    toast(message, options),

  success: (message: ToastMessage, options?: ExternalToast) =>
    toast.success(message, {
      className: "!bg-green-600 !text-white !border-green-700",
      ...options,
    }),

  info: (message: ToastMessage, options?: ExternalToast) =>
    toast.info(message, options),

  warning: (message: ToastMessage, options?: ExternalToast) =>
    toast.warning(message, options),

  error: (message: ToastMessage, options?: ExternalToast) =>
    toast.error(message, createErrorOptions(options)),

  loading: (message: ToastMessage, options?: ExternalToast) =>
    toast.loading(message, options),

  promise: toast.promise,

  dismiss: toast.dismiss,

  fromError: (error: unknown, options?: ExternalToast) =>
    toast.error(getErrorMessage(error), createErrorOptions(options)),
};
