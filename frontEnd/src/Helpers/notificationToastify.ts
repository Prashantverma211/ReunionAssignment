import { toast, ToastOptions, IconProps } from "react-toastify";

interface NotificationStyle extends ToastOptions<unknown> {
  icon?:
    | false
    | ((props: IconProps) => React.ReactNode)
    | React.ReactElement<IconProps>;
}

const notificationStyle: NotificationStyle = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  icon: undefined,
};

export const toastifySuccess = (message: string, icon?: ""): void => {
  if (icon) {
    notificationStyle.icon = icon;
  }
  toast.success(message, notificationStyle);
};

export const toastifyWarning = (
  message: string,
  icon: undefined = undefined
): void => {
  if (icon) {
    notificationStyle.icon = icon;
  }
  notificationStyle.theme = "light";
  notificationStyle.autoClose = 5000;
  toast.warn(message, notificationStyle);
};

export const toastifyError = (
  message: string,
  icon: undefined = undefined
): void => {
  if (icon) {
    notificationStyle.icon = icon;
  }
  toast.error(message, notificationStyle);
};
