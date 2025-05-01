"use client";

import { useEffect, useState, useTransition } from "react";
import SubContainer from "./sub-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addTag, removeTagById } from "@/lib/actions/admin.actions";
import { TagType } from "@/types";
import { XCircle } from "lucide-react";
import useCustomToast from "@/hooks/use-custom-toast";

const TagBox = ({ data }: { data: TagType[] }) => {
  const { openToast } = useCustomToast();
  const [currentTag, setCurrentTag] = useState("");
  const [isPending, startTransition] = useTransition();
  const [tagList, setTagList] = useState(data || []);

  useEffect(() => {
    setTagList(data);
  }, [data]);

  const addTagHandler = () => {
    startTransition(async () => {
      const response = await addTag(currentTag);
      openToast(response);
      setCurrentTag("");
    });
  };

  const deleteTagHandler = (currentTag: string) => {
    startTransition(async () => {
      const response = await removeTagById(currentTag);
      openToast(response);
    });
  };

  return (
    <SubContainer title="Add Tag">
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
      <div className="flex">
        <Input
          value={currentTag}
          className="w-[200px]"
          placeholder="Enter tag name"
          onChange={(e) => setCurrentTag(e.target.value)}
        />
        <Button disabled={isPending} onClick={() => addTagHandler()}>
          Add Tag
        </Button>
      </div>
    </SubContainer>
  );
};

export default TagBox;
