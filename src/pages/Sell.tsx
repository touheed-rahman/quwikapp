
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import SellStepOne from "@/components/sell/SellStepOne";
import SellFormDetails from "@/components/sell/SellFormDetails";
import Header from "@/components/Header";
import ChatWindow from "@/components/chat/ChatWindow";
import { supabase } from "@/integrations/supabase/client";

const Sell = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [location, setLocation] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStepOneComplete = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !price || !condition || !location) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to post an ad",
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }

      const imageUploadPromises = formData.images.map(async (image: File) => {
        const filename = `${crypto.randomUUID()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filename, image);

        if (uploadError) throw uploadError;
        return filename;
      });

      const uploadedImagePaths = await Promise.all(imageUploadPromises);
      
      const { error } = await supabase.from('listings').insert({
        title,
        description,
        price: parseFloat(price),
        category: formData.category,
        subcategory: formData.subcategory,
        condition,
        location,
        images: uploadedImagePaths,
        user_id: user.id,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Ad Posted Successfully!",
        description: "Your ad will be visible after review.",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/');

    } catch (error) {
      console.error('Error posting ad:', error);
      toast({
        title: "Error",
        description: "Failed to post your ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 1) {
    return (
      <>
        <SellStepOne onNext={handleStepOneComplete} />
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
          location={location}
          setLocation={setLocation}
          isSubmitting={isSubmitting}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      </div>
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Sell;
