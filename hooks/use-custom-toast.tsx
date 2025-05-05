import { toast } from "./use-toast";

const useCustomToast = () => {
  const openToast = ({
    success = true,
    message: description,
  }: {
    success?: boolean;
    message: string;
  }) =>
    toast({
      variant: success ? "default" : "destructive",
      description,
    });
  return { openToast };
};

export default useCustomToast;
