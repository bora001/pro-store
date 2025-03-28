import { cn } from "@/lib/utils";
import { Fragment } from "react";

const checkoutSteps = [
  "Shipping Address",
  "Payment Method",
  "Place Order",
] as const;
type CheckoutStepType = (typeof checkoutSteps)[number];

const CheckoutStep = ({ step }: { step: CheckoutStepType }) => {
  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10 max-w-max mx-auto">
      {checkoutSteps.map((currentStep) => (
        <Fragment key={currentStep}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm border",
              currentStep === step && "bg-secondary"
            )}
          >
            {currentStep}
          </div>
          {currentStep !== "Place Order" && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default CheckoutStep;
