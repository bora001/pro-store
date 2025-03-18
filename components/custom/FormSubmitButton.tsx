import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

const FormSubmitButton = ({
  text,
  className,
}: {
  text: string[];
  className?: string;
}) => {
  const { pending } = useFormStatus();
  const [processingText, defaultText] = text;
  return (
    <Button className={`${className} w-full`} disabled={pending}>
      {pending ? processingText : defaultText}
    </Button>
  );
};

export default FormSubmitButton;
