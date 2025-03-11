
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FeatureIconType, FeatureOption } from "./types";
import FeatureOptionCard from "./FeatureOptionCard";

interface FeatureOptionsStepProps {
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  featureOptions: FeatureOption[];
  freeRequestsCount: number | null;
}

export default function FeatureOptionsStep({ 
  selectedOption, 
  setSelectedOption,
  featureOptions,
  freeRequestsCount
}: FeatureOptionsStepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Feature Your Listing</DialogTitle>
        <DialogDescription>
          Make your listing stand out by featuring it on our platform
          {freeRequestsCount !== null && (
            <span className="block mt-1 text-sm text-primary">
              You have used {freeRequestsCount}/3 free feature requests
            </span>
          )}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 my-4">
        {featureOptions.map((option) => (
          <FeatureOptionCard
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onSelect={setSelectedOption}
          />
        ))}
      </div>
    </>
  );
}
