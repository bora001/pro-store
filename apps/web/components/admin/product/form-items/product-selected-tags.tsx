import { useFormContext, useWatch } from "react-hook-form";
import TagList from "../../setting/tag-list";

const ProductSelectedTags = ({
  deleteTagHandler,
}: {
  deleteTagHandler?: (currentTag: string) => void;
}) => {
  const { control } = useFormContext();
  const tags = useWatch({ name: "tags", control });
  return <TagList tagList={tags || []} deleteTagHandler={deleteTagHandler} />;
};

export default ProductSelectedTags;
