import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
const ShippingField = ({
  title,
  placeholder,
}: {
  title: string;
  placeholder: string;
}) => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col md:flex-row gap-5">
      <FormField
        control={control}
        name={title}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>{title}</FormLabel>
            <FormControl>
              <Input placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ShippingField;
