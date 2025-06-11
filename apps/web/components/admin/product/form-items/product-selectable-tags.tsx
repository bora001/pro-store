import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCustomToast from "@/hooks/use-custom-toast";
import { TagType } from "@/types";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
const ProductSelectableTags = ({ tagList }: { tagList: TagType[] }) => {
  const [selectValue, setSelectValue] = useState<string | undefined>(undefined);
  const { openToast } = useCustomToast();
  const { setValue, getValues, control } = useFormContext();
  const tags = useWatch({ name: "tags", control });

  const onChange = (id: string) => {
    const hasSameItem = tags.some((item: TagType) => item.id === id);

    if (hasSameItem) {
      openToast({ message: "An identical item already exists" });
      return;
    }
    const item = tagList.find((item) => item.id === id);
    setValue("tags", [...getValues("tags"), item]);
    setSelectValue(undefined);
  };

  return (
    <Select onValueChange={onChange} value={selectValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a tag" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {tagList?.map(({ name, id }) => (
            <SelectItem value={id} key={name}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ProductSelectableTags;
