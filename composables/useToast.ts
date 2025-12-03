export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

export const useToast = () => {
  const show = (message: string, type: Toast["type"] = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(7);

    toasts.value.push({
      id,
      type,
      message,
      duration,
    });

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  };

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration?: number) => {
    show(message, "success", duration);
  };

  const error = (message: string, duration?: number) => {
    show(message, "error", duration);
  };

  const info = (message: string, duration?: number) => {
    show(message, "info", duration);
  };

  const warning = (message: string, duration?: number) => {
    show(message, "warning", duration);
  };

  return {
    toasts: readonly(toasts),
    show,
    remove,
    success,
    error,
    info,
    warning,
  };
};
