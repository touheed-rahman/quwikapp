
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

export default function FeatureManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pricing');
  const [isLoading, setIsLoading] = useState(true);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>({});
  
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  
  const [editPricing, setEditPricing] = useState<any>(null);
  const [editCoupon, setEditCoupon] = useState<any>(null);
  
  // Form states
  const [pricingForm, setPricingForm] = useState({
    id: '',
    category: '',
    subcategory: '',
    feature_type: 'homepage',
    price: '',
    original_price: ''
  });
  
  const [couponForm, setCouponForm] = useState({
    id: '',
    code: '',
    discount_percent: '',
    discount_amount: '',
    min_order_amount: '',
    max_discount: '',
    valid_from: '',
    valid_until: '',
    usage_limit: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load pricing data
      const { data: pricing, error: pricingError } = await supabase
        .from('feature_pricing')
        .select('*')
        .order('category', { ascending: true });
      
      if (pricingError) throw pricingError;
      setPricingData(pricing || []);
      
      // Load coupons data
      const { data: couponData, error: couponError } = await supabase
        .from('feature_coupons')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (couponError) throw couponError;
      setCoupons(couponData || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message || "Failed to load feature management data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadCategories = async () => {
    try {
      // Get unique categories
      const { data: categoryData, error: categoryError } = await supabase
        .from('listings')
        .select('category')
        .order('category')
        .limit(100);
        
      if (categoryError) throw categoryError;
      
      const uniqueCategories = [...new Set(categoryData?.map(item => item.category))];
      setCategories(['default', ...uniqueCategories.filter(c => c)]);
      
      // Get subcategories for each category
      const subcats: Record<string, string[]> = {};
      for (const category of uniqueCategories) {
        if (!category) continue;
        
        const { data: subcategoryData } = await supabase
          .from('listings')
          .select('subcategory')
          .eq('category', category)
          .order('subcategory');
          
        const uniqueSubcategories = [...new Set(subcategoryData?.map(item => item.subcategory))];
        subcats[category] = uniqueSubcategories.filter(s => s);
      }
      
      setSubcategories(subcats);
    } catch (error: any) {
      console.error("Failed to load categories:", error);
    }
  };
  
  const handleAddPricing = () => {
    setEditPricing(null);
    setPricingForm({
      id: '',
      category: 'default',
      subcategory: '',
      feature_type: 'homepage',
      price: '',
      original_price: ''
    });
    setIsPricingDialogOpen(true);
  };
  
  const handleEditPricing = (pricing: any) => {
    setEditPricing(pricing);
    setPricingForm({
      id: pricing.id,
      category: pricing.category,
      subcategory: pricing.subcategory || '',
      feature_type: pricing.feature_type,
      price: pricing.price.toString(),
      original_price: pricing.original_price?.toString() || ''
    });
    setIsPricingDialogOpen(true);
  };
  
  const handleAddCoupon = () => {
    setEditCoupon(null);
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    setCouponForm({
      id: '',
      code: '',
      discount_percent: '',
      discount_amount: '',
      min_order_amount: '',
      max_discount: '',
      valid_from: today.toISOString().slice(0, 16),
      valid_until: nextMonth.toISOString().slice(0, 16),
      usage_limit: ''
    });
    setIsCouponDialogOpen(true);
  };
  
  const handleEditCoupon = (coupon: any) => {
    setEditCoupon(coupon);
    setCouponForm({
      id: coupon.id,
      code: coupon.code,
      discount_percent: coupon.discount_percent?.toString() || '',
      discount_amount: coupon.discount_amount?.toString() || '',
      min_order_amount: coupon.min_order_amount?.toString() || '',
      max_discount: coupon.max_discount?.toString() || '',
      valid_from: coupon.valid_from?.slice(0, 16) || '',
      valid_until: coupon.valid_until?.slice(0, 16) || '',
      usage_limit: coupon.usage_limit?.toString() || ''
    });
    setIsCouponDialogOpen(true);
  };
  
  const savePricing = async () => {
    try {
      const formData = {
        category: pricingForm.category,
        subcategory: pricingForm.subcategory || null,
        feature_type: pricingForm.feature_type,
        price: parseFloat(pricingForm.price),
        original_price: pricingForm.original_price ? parseFloat(pricingForm.original_price) : null
      };
      
      if (editPricing) {
        // Update existing
        const { error } = await supabase
          .from('feature_pricing')
          .update(formData)
          .eq('id', editPricing.id);
          
        if (error) throw error;
        toast({
          title: "Pricing updated",
          description: "Feature pricing has been updated successfully"
        });
      } else {
        // Create new
        const { error } = await supabase
          .from('feature_pricing')
          .insert(formData);
          
        if (error) throw error;
        toast({
          title: "Pricing added",
          description: "New feature pricing has been added successfully"
        });
      }
      
      setIsPricingDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error saving pricing",
        description: error.message || "Failed to save pricing",
        variant: "destructive"
      });
    }
  };
  
  const saveCoupon = async () => {
    try {
      const formData = {
        code: couponForm.code,
        discount_percent: couponForm.discount_percent ? parseInt(couponForm.discount_percent) : null,
        discount_amount: couponForm.discount_amount ? parseFloat(couponForm.discount_amount) : null,
        min_order_amount: couponForm.min_order_amount ? parseFloat(couponForm.min_order_amount) : null,
        max_discount: couponForm.max_discount ? parseFloat(couponForm.max_discount) : null,
        valid_from: couponForm.valid_from,
        valid_until: couponForm.valid_until,
        usage_limit: couponForm.usage_limit ? parseInt(couponForm.usage_limit) : null
      };
      
      if (editCoupon) {
        // Update existing
        const { error } = await supabase
          .from('feature_coupons')
          .update(formData)
          .eq('id', editCoupon.id);
          
        if (error) throw error;
        toast({
          title: "Coupon updated",
          description: "Coupon has been updated successfully"
        });
      } else {
        // Create new
        const { error } = await supabase
          .from('feature_coupons')
          .insert(formData);
          
        if (error) throw error;
        toast({
          title: "Coupon added",
          description: "New coupon has been added successfully"
        });
      }
      
      setIsCouponDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error saving coupon",
        description: error.message || "Failed to save coupon",
        variant: "destructive"
      });
    }
  };
  
  const deletePricing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('feature_pricing')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Pricing deleted",
        description: "Feature pricing has been deleted successfully"
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: "Error deleting pricing",
        description: error.message || "Failed to delete pricing",
        variant: "destructive"
      });
    }
  };
  
  const deleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('feature_coupons')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Coupon deleted",
        description: "Coupon has been deleted successfully"
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: "Error deleting coupon",
        description: error.message || "Failed to delete coupon",
        variant: "destructive"
      });
    }
  };
  
  const getFeatureTypeName = (type: string) => {
    switch (type) {
      case 'homepage': return 'Homepage Feature';
      case 'productPage': return 'Category Feature';
      case 'both': return 'Premium Feature';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Management</CardTitle>
          <CardDescription>Manage pricing, feature settings, and coupon codes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pricing" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Feature Pricing</h3>
                <Button onClick={handleAddPricing}>Add Pricing</Button>
              </div>
              
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategory</TableHead>
                        <TableHead>Feature Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Original Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pricingData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No pricing data found. Add some pricing settings to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        pricingData.map((pricing) => (
                          <TableRow key={pricing.id}>
                            <TableCell>{pricing.category}</TableCell>
                            <TableCell>{pricing.subcategory || '-'}</TableCell>
                            <TableCell>{getFeatureTypeName(pricing.feature_type)}</TableCell>
                            <TableCell>₹{pricing.price}</TableCell>
                            <TableCell>{pricing.original_price ? `₹${pricing.original_price}` : '-'}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 mr-1"
                                onClick={() => handleEditPricing(pricing)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-destructive hover:text-destructive"
                                onClick={() => deletePricing(pricing.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="coupons" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Coupon Codes</h3>
                <Button onClick={handleAddCoupon}>Add Coupon</Button>
              </div>
              
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Valid Until</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No coupons found. Create a coupon to offer discounts.
                          </TableCell>
                        </TableRow>
                      ) : (
                        coupons.map((coupon) => (
                          <TableRow key={coupon.id}>
                            <TableCell className="font-medium">{coupon.code}</TableCell>
                            <TableCell>
                              {coupon.discount_percent ? `${coupon.discount_percent}%` : ''}
                              {coupon.discount_amount ? `₹${coupon.discount_amount}` : ''}
                            </TableCell>
                            <TableCell>
                              {new Date(coupon.valid_until).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {coupon.usage_count || 0}
                              {coupon.usage_limit ? `/${coupon.usage_limit}` : ''}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 mr-1"
                                onClick={() => handleEditCoupon(coupon)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-destructive hover:text-destructive"
                                onClick={() => deleteCoupon(coupon.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Pricing Dialog */}
      <Dialog open={isPricingDialogOpen} onOpenChange={setIsPricingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editPricing ? 'Edit' : 'Add'} Feature Pricing</DialogTitle>
            <DialogDescription>
              Set pricing for feature listings by category and feature type.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={pricingForm.category} 
                onValueChange={(value) => setPricingForm({...pricingForm, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {pricingForm.category && pricingForm.category !== 'default' && (
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                <Select 
                  value={pricingForm.subcategory} 
                  onValueChange={(value) => setPricingForm({...pricingForm, subcategory: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Apply to all subcategories)</SelectItem>
                    {subcategories[pricingForm.category]?.map(subcategory => (
                      <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="feature_type">Feature Type</Label>
              <Select 
                value={pricingForm.feature_type} 
                onValueChange={(value) => setPricingForm({...pricingForm, feature_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feature type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage">Homepage Feature</SelectItem>
                  <SelectItem value="productPage">Category Feature</SelectItem>
                  <SelectItem value="both">Premium Feature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input 
                id="price" 
                type="number" 
                value={pricingForm.price}
                onChange={(e) => setPricingForm({...pricingForm, price: e.target.value})}
                placeholder="Enter price"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price (₹) (Optional)</Label>
              <Input 
                id="original_price" 
                type="number" 
                value={pricingForm.original_price}
                onChange={(e) => setPricingForm({...pricingForm, original_price: e.target.value})}
                placeholder="Enter original price"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPricingDialogOpen(false)}>Cancel</Button>
            <Button onClick={savePricing}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Coupon Dialog */}
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCoupon ? 'Edit' : 'Add'} Coupon</DialogTitle>
            <DialogDescription>
              Create coupon codes for feature listing discounts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input 
                id="code" 
                value={couponForm.code}
                onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                placeholder="Enter coupon code"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount_percent">Discount Percentage (%)</Label>
                <Input 
                  id="discount_percent" 
                  type="number" 
                  value={couponForm.discount_percent}
                  onChange={(e) => setCouponForm({...couponForm, discount_percent: e.target.value})}
                  placeholder="e.g. 10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount_amount">OR Discount Amount (₹)</Label>
                <Input 
                  id="discount_amount" 
                  type="number" 
                  value={couponForm.discount_amount}
                  onChange={(e) => setCouponForm({...couponForm, discount_amount: e.target.value})}
                  placeholder="e.g. 100"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_order_amount">Min Order Amount (₹)</Label>
                <Input 
                  id="min_order_amount" 
                  type="number" 
                  value={couponForm.min_order_amount}
                  onChange={(e) => setCouponForm({...couponForm, min_order_amount: e.target.value})}
                  placeholder="Optional"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_discount">Max Discount (₹)</Label>
                <Input 
                  id="max_discount" 
                  type="number" 
                  value={couponForm.max_discount}
                  onChange={(e) => setCouponForm({...couponForm, max_discount: e.target.value})}
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valid_from">Valid From</Label>
                <Input 
                  id="valid_from" 
                  type="datetime-local" 
                  value={couponForm.valid_from}
                  onChange={(e) => setCouponForm({...couponForm, valid_from: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valid_until">Valid Until</Label>
                <Input 
                  id="valid_until" 
                  type="datetime-local" 
                  value={couponForm.valid_until}
                  onChange={(e) => setCouponForm({...couponForm, valid_until: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usage_limit">Usage Limit</Label>
              <Input 
                id="usage_limit" 
                type="number" 
                value={couponForm.usage_limit}
                onChange={(e) => setCouponForm({...couponForm, usage_limit: e.target.value})}
                placeholder="Leave empty for unlimited uses"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCoupon}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
