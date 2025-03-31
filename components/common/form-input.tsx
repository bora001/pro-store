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
type FormInputPropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  type?: string;
};
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
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{capitalize(name)}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
