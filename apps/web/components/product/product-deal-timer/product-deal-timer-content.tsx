import { useState, useEffect } from "react";

const ProductDealTimerContent = ({
  trimmedTime,
}: {
  trimmedTime: string[];
}) => {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  return (
    <div className={"flex gap-1"}>
      {trimmedTime.length &&
        isMount &&
        trimmedTime.map((item, index) => (
          <div key={`${item}_${index}`} className="flex gap-1">
            <span>{item}</span>
            <span
              className={`${index === trimmedTime.length - 1 ? "hidden" : "block"} `}
            >
              :
            </span>
          </div>
        ))}
    </div>
  );
};

export default ProductDealTimerContent;
