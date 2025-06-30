import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifySuccess = (msg) => toast.success(msg);
export const notifyError = (msg) => toast.error(msg);
export const notifyInfo = (msg) => toast.info(msg);
export const notifyDanger = (msg) => toast.error(msg);
export const notifyDelete = (msg = "Item deleted!") =>
  toast(msg, {
    type: "delete",
    icon: "🗑️",
    position: "top-right",
    autoClose: 3000,
  });