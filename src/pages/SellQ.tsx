
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  Upload, 
  Camera, 
  X, 
  Check, 
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import CategorySelector from '@/components/sell/CategorySelector';
import SubcategorySelector from '@/components/sell/SubcategorySelector';
import { useLocation } from '@/contexts/LocationContext';
import PriceInput from '@/components/sell/PriceInput';
import { motion } from 'framer-motion';

const SellQ = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formComplete, setFormComplete] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedLocation } = useLocation();

  useEffect(() => {
    // Check if basic form is completed
    const isBasicFormComplete = 
      title.trim() !== '' &&
      description.trim() !== '' &&
      price !== '' &&
      category !== null &&
      subcategory !== null &&
      selectedLocation !== null;
    
    setFormComplete(isBasicFormComplete);
  }, [title, description, price, category, subcategory, selectedLocation]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, // Use back camera by default
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Listen for data
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      // When recording stops
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        
        // Create a file from blob
        const videoFile = new File([blob], `recording_${Date.now()}.mp4`, { type: 'video/mp4' });
        
        setVideoFile(videoFile);
        setVideoUrl(url);
        
        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        chunksRef.current = [];
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Automatically stop recording after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access error",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
    setVideoUrl(URL.createObjectURL(file));
  };
  
  const discardVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    
    setVideoFile(null);
    setVideoUrl(null);
    
    // Clean up any active streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile || !selectedLocation) {
      toast({
        title: "Missing information",
        description: "Please complete all fields and add a video",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to post a video",
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }
      
      // 2. Create the listing
      const listingData = {
        title,
        description,
        price: parseFloat(price),
        category,
        subcategory,
        location: selectedLocation,
        user_id: user.id,
        status: 'pending',
        images: [] // No images for Q videos
      };
      
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .insert(listingData)
        .select()
        .single();
      
      if (listingError) throw listingError;
      
      // 3. Upload the video
      setIsUploading(true);
      const fileName = `${listingData.id}_${Date.now()}.mp4`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_videos')
        .upload(fileName, videoFile);
      
      if (uploadError) throw uploadError;
      
      // 4. Create product_video entry
      const { error: productVideoError } = await supabase
        .from('product_videos' as any)
        .insert({
          listing_id: listingData.id,
          video_url: fileName,
          user_id: user.id
        });
      
      if (productVideoError) throw productVideoError;
      
      toast({
        title: "Video Ad Posted Successfully!",
        description: "Your video ad will be visible after review.",
      });
      
      // Navigate to the Q feed
      setTimeout(() => navigate('/q'), 1000);
      
    } catch (error: any) {
      console.error('Error posting video ad:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to post your video ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        {formComplete && videoUrl ? (
          <div className="max-w-md mx-auto">
            <button 
              onClick={() => setFormComplete(false)}
              className="flex items-center text-primary mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to form
            </button>
            
            <Card className="overflow-hidden">
              <div className="aspect-[9/16] relative">
                <video 
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  onMouseEnter={() => setShowVideoControls(true)}
                  onMouseLeave={() => setShowVideoControls(false)}
                />
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{title}</h3>
                  <p className="text-lg font-bold">₹{price}</p>
                  <p className="text-sm text-muted-foreground">{category} &gt; {subcategory}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="flex-1"
                    onClick={discardVideo}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-record
                  </Button>
                  
                  <Button 
                    type="button" 
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {isUploading ? 'Uploading...' : 'Posting...'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Post Video
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : formComplete ? (
          <div className="max-w-md mx-auto">
            <button 
              onClick={() => setFormComplete(false)}
              className="flex items-center text-primary mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to form
            </button>
            
            <Card className="overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Record or Upload Video</h2>
                
                {videoUrl ? (
                  <div className="aspect-[9/16] relative mb-4">
                    <video 
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-cover rounded-md"
                      controls
                    />
                    <button 
                      className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                      onClick={discardVideo}
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ) : isRecording ? (
                  <div className="aspect-[9/16] relative mb-4 bg-black rounded-md overflow-hidden">
                    <video 
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-white text-sm font-medium">Recording</span>
                      </div>
                    </div>
                    
                    <button 
                      className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white rounded-full p-4"
                      onClick={stopRecording}
                    >
                      <Check className="h-6 w-6 text-primary" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Button 
                      variant="outline" 
                      className="h-32 flex flex-col gap-2"
                      onClick={startRecording}
                    >
                      <Camera className="h-8 w-8" />
                      <span>Record Video</span>
                      <span className="text-xs text-muted-foreground">15-30 sec</span>
                    </Button>
                    
                    <label className="h-32 flex flex-col items-center justify-center gap-2 border rounded-md hover:bg-accent cursor-pointer">
                      <Upload className="h-8 w-8" />
                      <span>Upload Video</span>
                      <span className="text-xs text-muted-foreground">Max 30MB</span>
                      <input 
                        type="file" 
                        accept="video/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
                
                {videoUrl && (
                  <Button 
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {isUploading ? 'Uploading...' : 'Posting...'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Post Video
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card>
              <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Create Video Ad</h2>
                  <Video className="h-5 w-5 text-primary" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What are you selling?"
                      maxLength={50}
                    />
                    <div className="text-xs text-right text-muted-foreground mt-1">
                      {title.length}/50
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your item briefly..."
                      rows={3}
                      maxLength={200}
                    />
                    <div className="text-xs text-right text-muted-foreground mt-1">
                      {description.length}/200
                    </div>
                  </div>
                  
                  <div>
                    <Label>Price</Label>
                    <PriceInput value={price} onChange={setPrice} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <CategorySelector 
                        value={category} 
                        onChange={(val) => {
                          setCategory(val);
                          setSubcategory(null);
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label>Subcategory</Label>
                      <SubcategorySelector 
                        category={category} 
                        value={subcategory} 
                        onChange={setSubcategory}
                        disabled={!category}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => setFormComplete(true)}
                    disabled={!formComplete}
                  >
                    Continue to Video
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SellQ;
