
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { Progress } from '@/components/ui/progress';
import CategorySelector from '@/components/sell/CategorySelector';
import SubcategorySelector from '@/components/sell/SubcategorySelector';

const SellQ = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [step, setStep] = useState(1); // 1 for form, 2 for video capture
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  // Get user's location
  useEffect(() => {
    const fetchLocation = async () => {
      setIsLocationLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('location')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        if (userData && userData.location) {
          setLocation(userData.location);
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      } finally {
        setIsLocationLoading(false);
      }
    };
    
    fetchLocation();
  }, []);

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

  const handleSubmit = async () => {
    if (!title || !description || !price || !selectedCategory || !selectedSubcategory || !location || !videoFile) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill all required fields',
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
    
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      // 1. Create the listing
      const listingInsertData = {
        title,
        description,
        price: Number(price),
        category: selectedCategory,
        subcategory: selectedSubcategory,
        location,
        user_id: userId,
        status: 'active',
        condition: 'used', // Default condition
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
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!title || !description || !price || !selectedCategory || !selectedSubcategory || !location) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <ProfileHeader /> : <Header />}
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        {step === 1 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create Q Video - Details</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your product"
                  maxLength={80}
                />
                <p className="text-xs text-gray-500 text-right">{title.length}/80</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product"
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">{description.length}/500</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Enter price"
                  min={0}
                />
              </div>
              
              <div className="space-y-4">
                <CategorySelector 
                  value={selectedCategory} 
                  onChange={setSelectedCategory}
                />
                
                <SubcategorySelector 
                  category={selectedCategory} 
                  value={selectedSubcategory} 
                  onChange={setSelectedSubcategory}
                  disabled={!selectedCategory}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  disabled={isLocationLoading}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <div className="flex w-full space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                
                <Button
                  className="flex-1"
                  onClick={handleContinue}
                >
                  Continue to Video
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create Q Video - Record or Upload</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {(!recordedVideo && !isRecording) && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center gap-2"
                    onClick={startRecording}
                  >
                    <Camera className="h-8 w-8 text-primary" />
                    <span className="text-lg font-medium">Record Video</span>
                    <span className="text-xs text-muted-foreground">15-30 seconds</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center gap-2"
                    onClick={() => videoFileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-primary" />
                    <span className="text-lg font-medium">Upload Video</span>
                    <span className="text-xs text-muted-foreground">From your device</span>
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
                      className="mr-2"
                    >
                      Discard Video
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              {isLoading && (
                <div className="w-full space-y-2">
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
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isLoading || !videoFile}
                >
                  {isLoading ? 'Uploading...' : 'Submit'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellQ;
