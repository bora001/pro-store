import { useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";

const MoveButtonToast = ({ path, text }: { path: string; text: string }) => {
  const router = useRouter();
  return (
    <ToastAction className="bg-primary text-white hover:bg-gray-800" altText={text} onClick={() => router.push(path)}>
      {text}
    </ToastAction>
  );
};

export default MoveButtonToast;
