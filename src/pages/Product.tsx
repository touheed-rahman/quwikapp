
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ChatWindow from "@/components/chat/ChatWindow";
import { supabase } from "@/integrations/supabase/client";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SellerInfo from "@/components/product/SellerInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import FeatureDialog from "@/components/product/FeatureDialog";
import ProductLoader from "@/components/product/ProductLoader";
import ProductNotFound from "@/components/product/ProductNotFound";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { useProductActions } from "@/hooks/useProductActions";
import { useToast } from "@/components/ui/use-toast";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Video, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Seller {
  id: string;
  full_name: string;
  created_at: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [session, setSession] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { data: product, isLoading, isError } = useProductDetails(id);
  const { data: relatedProducts = [] } = useRelatedProducts(id, product?.category, product?.subcategory);
  const {
    isOfferDialogOpen,
    setIsOfferDialogOpen,
    currentConversationId,
    handleChatWithSeller,
    handleMakeOffer
  } = useProductActions(id, product?.user_id);

  // Fetch seller data
  const { data: seller } = useQuery({
    queryKey: ['seller', product?.user_id],
    queryFn: async () => {
      if (!product?.user_id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', product.user_id)
        .single();
      
      if (error) throw error;
      return data as Seller;
    },
    enabled: !!product?.user_id
  });

  // Check if product has video
  useEffect(() => {
    if (!id) return;

    const checkVideo = async () => {
      const { data, error } = await supabase
        .from('product_videos')
        .select('id')
        .eq('listing_id', id)
        .maybeSingle();

      if (!error && data) {
        setHasVideo(true);
      }
    };

    checkVideo();
  }, [id]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setCurrentUserId(session?.user?.id || null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCurrentUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      navigate(`/chat/${currentConversationId}`);
    }
  }, [currentConversationId, navigate]);

  const isCurrentUserSeller = !!currentUserId && currentUserId === product?.user_id;

  const handleVideoUpload = async () => {
    if (!videoFile || !id || !currentUserId) return;

    setIsUploading(true);
    try {
      // Upload the video to Supabase Storage
      const fileName = `${id}_${Date.now()}.mp4`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_videos')
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      // Create entry in product_videos table
      const { error: insertError } = await supabase
        .from('product_videos')
        .insert({
          listing_id: id,
          video_url: fileName,
          user_id: currentUserId
        });

      if (insertError) throw insertError;

      toast({
        title: "Video uploaded successfully",
        description: "Your product video is now live",
      });

      setHasVideo(true);
      setIsVideoUploadOpen(false);
      setVideoFile(null);
    } catch (error: any) {
      console.error("Video upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your video",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive"
      });
      return;
    }

    // Check file size (30MB max)
    if (file.size > 30 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video must be less than 30MB",
        variant: "destructive"
      });
      return;
    }

    setVideoFile(file);
  };

  const viewProductVideo = () => {
    if (id) {
      navigate(`/q?product=${id}`);
    }
  };

  if (isLoading) {
    return <ProductLoader />;
  }

  if (isError || !product) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 pt-20 pb-20 overflow-x-hidden max-w-full">
        <motion.div 
          className="grid lg:grid-cols-2 gap-4 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageGallery
              images={product.images}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
            />

            {/* Video actions */}
            <div className="mt-4 flex gap-3">
              {hasVideo ? (
                <Button 
                  onClick={viewProductVideo}
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <Video className="h-4 w-4" />
                  Watch Product Video
                </Button>
              ) : isCurrentUserSeller ? (
                <Button 
                  onClick={() => setIsVideoUploadOpen(true)}
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <Upload className="h-4 w-4" />
                  Add Product Video
                </Button>
              ) : null}
            </div>
          </motion.div>

          <motion.div 
            className="space-y-4 lg:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductInfo
              title={product.title}
              price={product.price}
              location={product.location}
              createdAt={product.created_at}
              condition={product.condition}
              description={product.description}
              category={product.category}
              adNumber={product.adNumber}
              id={product.id}
              viewCount={product.view_count}
              brand={product.brand}
              specs={product.specs}
            />

            {seller && (
              <SellerInfo
                seller={seller}
                currentUserId={currentUserId}
                isCurrentUserSeller={isCurrentUserSeller}
                onChatClick={() => handleChatWithSeller(session)}
                onMakeOffer={() => setIsFeatureDialogOpen(true)}
              />
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <RelatedProducts products={relatedProducts} />
        </motion.div>
      </main>

      <FeatureDialog
        isOpen={isFeatureDialogOpen}
        onClose={() => setIsFeatureDialogOpen(false)}
      />
      
      <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Video Upload Dialog */}
      <Dialog open={isVideoUploadOpen} onOpenChange={setIsVideoUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Product Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {videoFile ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{videoFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <video 
                    src={URL.createObjectURL(videoFile)} 
                    className="max-h-[200px] mx-auto" 
                    controls
                  />
                </div>
              ) : (
                <>
                  <Video className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label 
                      htmlFor="video-upload" 
                      className="cursor-pointer rounded-md bg-primary px-3 py-1 text-sm font-semibold text-white hover:bg-primary/90"
                    >
                      Select Video
                    </label>
                    <input 
                      id="video-upload" 
                      type="file" 
                      accept="video/*" 
                      className="sr-only" 
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Max 30MB. MP4, MOV or WebM formats recommended.
                  </p>
                </>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsVideoUploadOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleVideoUpload} 
                disabled={!videoFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Video"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductPage;
