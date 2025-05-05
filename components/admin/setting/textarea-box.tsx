"use client";

import { Button } from "@/components/ui/button";
import SubContainer from "./sub-container";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { updateSetting } from "@/lib/actions/admin.actions";
import useCustomToast from "@/hooks/use-custom-toast";
import { SettingKeyType } from "@/types";

const TextAreaBox = ({
  type,
  title,
  placeholder,
  data,
}: {
  type: SettingKeyType;
  data: string;
  title: string;
  placeholder: string;
}) => {
  const { openToast } = useCustomToast();
  const [text, setText] = useState(data);
  const [isSame, setIsSame] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [isPending, startTransition] = useTransition();

  const editHandler = () => {
    if (isEditable && data !== text) {
      setIsSame(false);
      return;
    }
    setIsSame(true);
    setIsEditable((prev) => !prev);
  };

  const saveHandler = () => {
    if (text === data) {
      openToast({ message: "No changes to save" });
      return;
    }

    startTransition(async () => {
      const response = await updateSetting({ [type]: text });
      if (response.success) {
        setIsEditable(false);
        setIsSame(true);
      }
      openToast(response);
    });
  };

  return (
    <SubContainer
      title={title}
      buttons={
        <div className="space-x-1">
          <Button onClick={() => editHandler()} variant="secondary">
            {isEditable ? "Lock" : "Edit"}
          </Button>
          <Button
            onClick={() => saveHandler()}
            disabled={isPending || !isEditable}
          >
            Save
          </Button>
        </div>
      }
    >
      <Textarea
        className={cn(isSame ? "border-inherit" : "border-red-500")}
        defaultValue={data}
        placeholder={placeholder}
        disabled={!isEditable}
        onChange={(e) => setText(e.target.value)}
      />
      {!isSame && (
        <p className="text-xs text-red-500">
          Please save your changes before locking
        </p>
      )}
    </SubContainer>
  );
};

export default TextAreaBox;
