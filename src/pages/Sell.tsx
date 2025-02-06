
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import SellStepOne from "@/components/sell/SellStepOne";
import Header from "@/components/Header";
import { Search, Loader2 } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";
import { supabase } from "@/integrations/supabase/client";

const cities = [
  {
    id: "bangalore",
    name: "Bangalore",
    areas: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "JP Nagar", "Electronic City"]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    areas: ["Andheri", "Bandra", "Colaba", "Juhu", "Powai", "Worli"]
  },
  {
    id: "delhi",
    name: "Delhi",
    areas: ["Connaught Place", "Hauz Khas", "Dwarka", "Saket", "Rohini", "Lajpat Nagar"]
  }
];

const Sell = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
    
    // Validate form fields
    if (!title || !description || !price || !condition || !selectedCity) {
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

      // Upload images to Supabase storage
      const imageUploadPromises = formData.images.map(async (image: File) => {
        const filename = `${crypto.randomUUID()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filename, image);

        if (uploadError) throw uploadError;
        return filename;
      });

      const uploadedImagePaths = await Promise.all(imageUploadPromises);
      
      // Insert listing into database
      const { error } = await supabase.from('listings').insert({
        title,
        description,
        price: parseFloat(price),
        category: formData.category,
        subcategory: formData.subcategory,
        condition,
        location: `${selectedCity}${selectedArea ? `, ${selectedArea}` : ''}`,
        images: uploadedImagePaths,
        user_id: user.id,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Ad Posted Successfully!",
        description: "Your ad will be visible after review.",
      });

      // Show success state for 2 seconds before redirecting
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

  const filteredAreas = selectedCity
    ? cities
        .find((city) => city.id === selectedCity)
        ?.areas.filter((area) =>
          area.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []
    : [];

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Ad title *
              </label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
                required 
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description *
              </label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include condition, features and reason for selling"
                className="min-h-[120px] resize-none"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Condition *
              </label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-8" 
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  City *
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCity && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Area *
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search area..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting Ad...
                </div>
              ) : (
                'Post Ad'
              )}
            </Button>
          </div>
        </form>
      </div>
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Sell;
