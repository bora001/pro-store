import { FieldValues, Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { capitalize } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

type FormInputPropsType<T extends FieldValues> = {
  name: Path<T>;
  placeholder: string;
  type?: FormInputType;
};
type FormInputType = "text" | "textarea" | "number";

const FormInput = <T extends FieldValues>({
  name,
  placeholder,
  type = "text",
}: FormInputPropsType<T>) => {
  const { control } = useFormContext();

  const isTextArea = type === "textarea";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const props = {
          placeholder,
          ...field,
        };
        return (
          <FormItem className="w-full">
            <FormLabel>{capitalize(name)}</FormLabel>
            <FormControl>
              <div>
                {isTextArea ? (
                  <Textarea {...props} className="resize-none" />
                ) : (
                  <Input {...props} type={type} />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormInput;
