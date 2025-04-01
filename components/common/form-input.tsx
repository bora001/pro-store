import { Control, FieldValues, Path } from "react-hook-form";
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
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  type?: FormInputType;
};
type FormInputType = "text" | "textarea" | "number";

const FormInput = <T extends FieldValues>({
  control,
  name,
  placeholder,
  type = "text",
}: FormInputPropsType<T>) => {
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
                {type === "text" && <Input {...props} type={type} />}
                {type === "textarea" && (
                  <Textarea {...props} className="resize-none" />
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
