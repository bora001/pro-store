import { toast } from "./use-toast";

const useCustomToast = () => {
  const openToast = ({
    success = true,
    message = "",
  }: {
    success?: boolean;
    message?: string;
  }) =>
    toast({
      variant: success ? "default" : "destructive",
      description: message,
    });
  return { openToast };
};

export default useCustomToast;
