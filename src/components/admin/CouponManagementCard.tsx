
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FeatureCoupon } from "./types";

export default function CouponManagementCard() {
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [validFrom, setValidFrom] = useState<Date | undefined>(new Date());
  const [validUntil, setValidUntil] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  const [usageLimit, setUsageLimit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleCreateCoupon = async () => {
    if (!code || !discountPercent || !validFrom || !validUntil) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if coupon code already exists - use type assertion
      const { data: existingCoupon, error: checkError } = await (supabase
        .from('feature_coupons') as any)
        .select('id')
        .eq('code', code)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingCoupon) {
        toast({
          title: "Coupon exists",
          description: "This coupon code already exists. Please use a different code.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create the coupon - use type assertion
      const { error: createError } = await (supabase
        .from('feature_coupons') as any)
        .insert({
          code,
          discount_percent: parseInt(discountPercent),
          discount_amount: discountAmount ? parseFloat(discountAmount) : null,
          min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : null,
          max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
          valid_from: validFrom?.toISOString(),
          valid_until: validUntil?.toISOString(),
          usage_limit: usageLimit ? parseInt(usageLimit) : null,
          usage_count: 0
        });

      if (createError) throw createError;

      toast({
        title: "Coupon created",
        description: "The coupon has been created successfully",
      });
      
      // Reset the form
      setCode("");
      setDiscountPercent("");
      setDiscountAmount("");
      setMinOrderAmount("");
      setMaxDiscount("");
      setValidFrom(new Date());
      setValidUntil(new Date(new Date().setMonth(new Date().getMonth() + 1)));
      setUsageLimit("");
    } catch (error: any) {
      console.error("Error creating coupon:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create coupon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupon Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Label htmlFor="couponCode">Coupon Code</Label>
              <Input
                id="couponCode"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER20"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={generateRandomCode}
              className="mb-0.5"
            >
              Generate
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPercent">Discount Percentage (%)</Label>
          <Input
            id="discountPercent"
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="e.g. 20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountAmount">Fixed Discount Amount (Optional)</Label>
          <Input
            id="discountAmount"
            type="number"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minOrderAmount">Min. Order Value (Optional)</Label>
            <Input
              id="minOrderAmount"
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              placeholder="e.g. 500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDiscount">Max. Discount (Optional)</Label>
            <Input
              id="maxDiscount"
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              placeholder="e.g. 200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Valid From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !validFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validFrom ? format(validFrom, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={validFrom}
                  onSelect={setValidFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Valid Until</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !validUntil && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validUntil ? format(validUntil, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={validUntil}
                  onSelect={setValidUntil}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
          <Input
            id="usageLimit"
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>

        <Button 
          className="w-full mt-6" 
          onClick={handleCreateCoupon}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Coupon"}
        </Button>
      </CardContent>
    </Card>
  );
}
