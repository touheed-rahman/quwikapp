
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { Progress } from '@/components/ui/progress';
import { useLocation } from "@/contexts/LocationContext";
import SellStepOne from "@/components/sell/SellStepOne";
import SellStepTwo from "@/components/sell/SellStepTwo";
import { Upload, Camera } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SellQ = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showVideoUI, setShowVideoUI] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { selectedLocation } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Get user's session
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/profile');
        return;
      }
      setUserId(session.user.id);
    };

    getUserSession();
  }, [navigate]);

  const handleStepOneComplete = useCallback((data: any) => {
    setFormData((prevData: any) => ({ ...prevData, ...data }));
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      setStep(2);
    });
  }, []);

  const handleBack = useCallback(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      setStep(1);
    });
  }, []);

  const handleCreateQ = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !condition || !selectedLocation || !formData.category || !formData.subcategory) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    setShowVideoUI(true);
  }, [title, description, price, condition, selectedLocation, formData, toast]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);
        
        // Create a File object from the Blob
        const videoFile = new File([blob], 'recorded-video.mp4', { type: 'video/mp4' });
        setVideoFile(videoFile);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = videoURL;
          videoRef.current.controls = true;
        }
        
        // Stop all tracks in the stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Automatically stop recording after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access camera or microphone',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a video file',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Video must be less than 100MB',
        variant: 'destructive',
      });
      return;
    }
    
    setVideoFile(file);
    setRecordedVideo(URL.createObjectURL(file));
  };

  const handleSubmitVideo = async () => {
    if (!videoFile) {
      toast({
        title: 'Missing Video',
        description: 'Please record or upload a video',
        variant: 'destructive',
      });
      return;
    }

    if (!userId) {
      toast({
        title: 'Authentication Error',
        description: 'Please sign in to continue',
        variant: 'destructive',
      });
      navigate('/profile');
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // 1. Create the listing
      const listingInsertData = {
        title,
        description,
        price: Number(price),
        category: formData.category,
        subcategory: formData.subcategory,
        location: selectedLocation,
        user_id: userId,
        status: 'active',
        condition: condition,
        images: [] // No images for Q video listings
      };
      
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .insert(listingInsertData)
        .select()
        .single();
      
      if (listingError) throw listingError;
      
      // 2. Upload the video
      const videoFileName = `${userId}_${Date.now()}.mp4`;
      
      // Create a simulated upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_videos')
        .upload(videoFileName, videoFile);
      
      clearInterval(progressInterval);
      setUploadProgress(95);
      
      if (uploadError) throw uploadError;
      
      // 3. Create an entry in the product_videos table
      const { error: videoEntryError } = await supabase
        .from('product_videos')
        .insert({
          listing_id: listingData.id,
          video_url: videoFileName,
          user_id: userId
        });
      
      if (videoEntryError) throw videoEntryError;
      
      setUploadProgress(100);
      
      toast({
        title: 'Success!',
        description: 'Your Q video has been uploaded',
      });
      
      // Navigate to the product page or back to home
      setTimeout(() => {
        navigate(`/product/${listingData.id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error creating Q video:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload your video',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showVideoUI) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isMobile ? <ProfileHeader /> : <Header />}
        
        <div className="container mx-auto px-4 pt-20 pb-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create Q Video</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">Title: {title}</h3>
                <p className="text-sm text-muted-foreground">Price: ₹{price}</p>
                
                {(!recordedVideo && !isRecording) && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={startRecording}
                    >
                      <Camera className="h-6 w-6" />
                      <span>Record Video</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => videoFileInputRef.current?.click()}
                    >
                      <Upload className="h-6 w-6" />
                      <span>Upload Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        ref={videoFileInputRef}
                        onChange={handleFileUpload}
                      />
                    </Button>
                  </div>
                )}
                
                {isRecording && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        muted
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        variant="destructive"
                        onClick={stopRecording}
                        className="flex items-center gap-2"
                      >
                        <span className="animate-pulse h-3 w-3 rounded-full bg-white" />
                        Stop Recording
                      </Button>
                    </div>
                  </div>
                )}
                
                {recordedVideo && !isRecording && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        src={recordedVideo}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRecordedVideo(null);
                          setVideoFile(null);
                          if (videoRef.current) {
                            videoRef.current.src = '';
                          }
                        }}
                      >
                        Discard Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <div className="p-6 border-t">
              {isSubmitting && (
                <div className="w-full space-y-2 mb-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    {uploadProgress < 100 ? 'Uploading video...' : 'Processing...'}
                  </p>
                </div>
              )}
              
              <div className="flex w-full space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowVideoUI(false)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                
                <Button
                  className="flex-1"
                  onClick={handleSubmitVideo}
                  disabled={isSubmitting || !videoFile}
                >
                  {isSubmitting ? 'Uploading...' : 'Submit'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="sticky top-0 z-10 bg-background/95 border-b border-primary/10 shadow-sm">
        <Header />
      </div>
      
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full pt-24"
          >
            <SellStepOne onNext={handleStepOneComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full pt-24"
          >
            <SellStepTwo
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              price={price}
              setPrice={setPrice}
              condition={condition}
              setCondition={setCondition}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onSubmit={handleCreateQ}
              category={formData.category}
              subcategory={formData.subcategory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellQ;
