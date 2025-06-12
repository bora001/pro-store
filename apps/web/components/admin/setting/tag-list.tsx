import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TagType } from "@/types";
import { XCircle } from "lucide-react";

const TagList = ({
  isPending,
  tagList,
  deleteTagHandler,
}: {
  isPending?: boolean;
  tagList: TagType[];
  deleteTagHandler?: (currentTag: string) => void;
}) => {
  const deleteHandler = (id: string) => {
    if (deleteTagHandler) {
      deleteTagHandler(id);
    }
  };
  return (
    <div
      className={cn(
        "border rounded-sm border-gray-100 p-3 gap-4 flex-wrap max-h-[95px] overflow-y-auto",
        tagList.length ? "flex" : "hidden"
      )}
    >
      {tagList.map(({ name, id }, index) => (
        <Button
          type="button"
          disabled={isPending}
          variant="ghost"
          key={`${name}_${index}`}
          className="bg-gray-100 rounded-sm relative"
          onClick={() => deleteHandler(id)}
        >
          <XCircle
            color="red"
            size={12}
            className="absolute -right-1 -top-1 cursor-pointer"
          />
          {name}
        </Button>
      ))}
    </div>
  );
};

export default TagList;
