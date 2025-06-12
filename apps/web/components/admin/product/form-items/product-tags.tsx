import { FormLabel } from "@/components/ui/form";
import { TagType } from "@/types";
import ProductSelectableTags from "./product-selectable-tags";
import ProductSelectedTags from "./product-selected-tags";
import { useFormContext } from "react-hook-form";

const ProductTags = ({ allTags }: { allTags: TagType[] }) => {
  const { setValue, getValues } = useFormContext();
  const deleteTagHandler = (id: string) => {
    const tag = getValues("tags").filter((item: TagType) => item.id !== id);
    setValue("tags", tag);
  };
  return (
    <div className="flex flex-col gap-3">
      <FormLabel>Tags</FormLabel>
      <ProductSelectedTags deleteTagHandler={deleteTagHandler} />
      <ProductSelectableTags tagList={allTags} />
    </div>
  );
};

export default ProductTags;
