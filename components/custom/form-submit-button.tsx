import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "../ui/button";

const FormSubmitButton = ({
  text,
  className,
  disabled = false,
  ...props
}: {
  text: string[];
  className?: string;
  disabled?: boolean;
} & ButtonProps) => {
  const { pending } = useFormStatus();
  const [processingText, defaultText] = text;
  return (
    <Button className={`${className} w-full`} disabled={pending || disabled} {...props}>
      {pending ? processingText : defaultText}
    </Button>
  );
};

export default FormSubmitButton;
