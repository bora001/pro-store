import { Button } from "@/components/ui/button";
import { TagType } from "@/types";
import { XCircle } from "lucide-react";

const TagList = ({
  isPending,
  tagList,
  deleteTagHandler,
}: {
  isPending: boolean;
  tagList: TagType[];
  deleteTagHandler: (currentTag: string) => void;
}) => {
  return (
    <div className="border rounded-sm border-gray-100 p-3 flex gap-4 flex-wrap max-h-[95px] overflow-y-auto ">
      {tagList.map(({ name, id }, index) => (
        <Button
          disabled={isPending}
          variant="ghost"
          key={`${name}_${index}`}
          className="bg-gray-100 rounded-sm relative"
          onClick={() => deleteTagHandler(id)}
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
