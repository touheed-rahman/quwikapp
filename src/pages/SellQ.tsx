
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
import { Upload, Camera, X, Sparkles, TextIcon, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FILTERS = [
  { name: 'Normal', class: '' },
  { name: 'Vintage', class: 'sepia brightness-90' },
  { name: 'Bright', class: 'brightness-125 contrast-110' },
  { name: 'Cool', class: 'hue-rotate-30 brightness-110' },
  { name: 'Warm', class: 'brightness-110 sepia-10' },
  { name: 'Dramatic', class: 'contrast-125 brightness-90' }
];

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
  const [captionText, setCaptionText] = useState("");
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [zoom, setZoom] = useState([1]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { selectedLocation } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const captionInputRef = useRef<HTMLInputElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Apply zoom to video element
    if (videoRef.current && isRecording) {
      videoRef.current.style.transform = `scale(${zoom[0]})`;
    }
  }, [zoom, isRecording]);

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

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const startRecording = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user"
        },
        audio: true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
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
        images: [], // No images for Q video listings
        caption: captionText || null // Store the caption text if any
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
          user_id: userId,
          caption: captionText || null,
          filter_applied: FILTERS[selectedFilter].name !== 'Normal' ? FILTERS[selectedFilter].name : null
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
        
        <div ref={videoContainerRef} className={`relative ${isFullScreen ? 'fixed inset-0 z-50 bg-black' : 'container mx-auto px-4 pt-20 pb-16'}`}>
          {(!recordedVideo && !isRecording) && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Create Q Video</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Title: {title}</h3>
                  <p className="text-sm text-muted-foreground">Price: ₹{price}</p>
                  
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
                </div>
              </CardContent>
            </Card>
          )}
          
          {isRecording && (
            <div className="space-y-4">
              <div className={`${isFullScreen ? 'w-full h-screen' : 'aspect-video'} bg-black rounded-lg relative overflow-hidden`}>
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${FILTERS[selectedFilter].class}`}
                  muted
                />
                
                {showCaptionInput && (
                  <div className="absolute bottom-20 left-0 right-0 flex justify-center px-4">
                    <input
                      ref={captionInputRef}
                      type="text"
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      placeholder="Add a caption..."
                      className="bg-black/60 text-white placeholder:text-gray-300 px-4 py-2 rounded-full w-full max-w-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
                
                {captionText && !showCaptionInput && (
                  <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                    <div className="bg-black/60 text-white px-4 py-2 rounded-full max-w-md text-center">
                      {captionText}
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 space-x-2 flex">
                  <Button variant="outline" size="icon" className="bg-black/60 text-white border-white/20 hover:bg-black/80" onClick={toggleFullScreen}>
                    {isFullScreen ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                  </Button>
                </div>
                
                <div className="absolute bottom-4 left-0 right-0">
                  <div className="flex justify-center space-x-3 mb-4">
                    <Button variant="outline" size="icon" className="bg-black/60 text-white border-white/20 hover:bg-black/80" onClick={() => setShowCaptionInput(!showCaptionInput)}>
                      <TextIcon className="h-5 w-5" />
                    </Button>
                    {FILTERS.map((filter, index) => (
                      <Button
                        key={filter.name}
                        variant={selectedFilter === index ? "default" : "outline"}
                        size="sm"
                        className={selectedFilter === index ? "bg-primary" : "bg-black/60 text-white border-white/20 hover:bg-black/80"}
                        onClick={() => setSelectedFilter(index)}
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="px-4 mb-4">
                    <div className="text-white text-xs mb-1 text-center">Zoom</div>
                    <Slider
                      value={zoom}
                      min={1}
                      max={2}
                      step={0.1}
                      onValueChange={setZoom}
                      className="w-full max-w-xs mx-auto"
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
              </div>
            </div>
          )}
          
          {recordedVideo && !isRecording && (
            <div className="space-y-4">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Preview Your Q Video</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      src={recordedVideo}
                      className={`w-full h-full object-cover ${FILTERS[selectedFilter].class}`}
                      controls
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Tabs defaultValue="filter" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="filter">Filters</TabsTrigger>
                        <TabsTrigger value="caption">Caption</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="filter" className="space-y-4 pt-4">
                        <div className="grid grid-cols-3 gap-2">
                          {FILTERS.map((filter, index) => (
                            <Button
                              key={filter.name}
                              variant={selectedFilter === index ? "default" : "outline"}
                              className="w-full"
                              onClick={() => setSelectedFilter(index)}
                            >
                              {filter.name}
                              {selectedFilter === index && <Check className="ml-2 h-4 w-4" />}
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="caption" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Add Caption</label>
                          <input
                            type="text"
                            value={captionText}
                            onChange={(e) => setCaptionText(e.target.value)}
                            placeholder="Write something about your item..."
                            className="w-full px-4 py-2 border rounded-md"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRecordedVideo(null);
                        setVideoFile(null);
                        if (videoRef.current) {
                          videoRef.current.src = '';
                        }
                        setCaptionText("");
                        setSelectedFilter(0);
                      }}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Discard & Re-record
                    </Button>
                    
                    <Button
                      onClick={handleSubmitVideo}
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? 'Uploading...' : 'Submit Q Video'}
                    </Button>
                  </div>
                  
                  {isSubmitting && (
                    <div className="w-full space-y-2 mt-4">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-center text-sm text-muted-foreground">
                        {uploadProgress < 100 ? 'Uploading video...' : 'Processing...'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {!isRecording && !recordedVideo && !isFullScreen && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowVideoUI(false)}
                disabled={isSubmitting}
              >
                Back to Details
              </Button>
            </div>
          )}
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
            <SellStepOne onNext={handleStepOneComplete} isQVideo={true} />
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
              isQVideo={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellQ;
