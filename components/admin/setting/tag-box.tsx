"use client";

import { KeyboardEvent, useEffect, useState, useTransition } from "react";
import SubContainer from "./sub-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addTag,
  removeTagById,
} from "@/lib/actions/admin/admin.setting.actions";
import { TagType } from "@/types";
import useCustomToast from "@/hooks/use-custom-toast";
import TagList from "./tag-list";

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

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      addTagHandler();
    }
  };

  return (
    <SubContainer title="Add Tag">
      <TagList
        isPending={isPending}
        tagList={tagList}
        deleteTagHandler={deleteTagHandler}
      />
      <div className="flex">
        <Input
          value={currentTag}
          className="w-[200px]"
          placeholder="Enter tag name"
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={(e) => onEnter(e)}
        />
        <Button disabled={isPending} onClick={() => addTagHandler()}>
          Add Tag
        </Button>
      </div>
    </SubContainer>
  );
};

export default TagBox;
