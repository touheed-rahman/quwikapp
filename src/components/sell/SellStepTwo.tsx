
import Header from "@/components/Header";
import SellFormDetails from "./SellFormDetails";
import { useLocation } from "@/contexts/LocationContext";

interface SellStepTwoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  category?: string;
}

const SellStepTwo = ({
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  condition,
  setCondition,
  isSubmitting,
  onBack,
  onSubmit,
  category
}: SellStepTwoProps) => {
  const { selectedLocation } = useLocation();

  return (
    <>
      <Header />
      <div className="container max-w-2xl mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-6 text-foreground">
          ITEM DETAILS
        </h1>
        <SellFormDetails
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          condition={condition}
          setCondition={setCondition}
          isSubmitting={isSubmitting}
          onBack={onBack}
          onSubmit={onSubmit}
          category={category}
        />
      </div>
    </>
  );
};

export default SellStepTwo;
