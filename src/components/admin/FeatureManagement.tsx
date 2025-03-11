
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FeaturePricingCard from "./FeaturePricingCard";
import CouponManagementCard from "./CouponManagementCard";

export default function FeatureManagement() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pricing">Pricing Management</TabsTrigger>
          <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pricing" className="space-y-4">
          <Card className="col-span-3 mb-4">
            <CardHeader>
              <CardTitle>Feature Pricing Overview</CardTitle>
              <CardDescription>
                Manage pricing for featured listings across different categories and feature types.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Set different prices for featuring listings based on category, subcategory, and feature type.
                Default prices will be used when specific category pricing is not set.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            <FeaturePricingCard />
            
            <Card>
              <CardHeader>
                <CardTitle>Feature Types Explained</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Homepage Feature</h3>
                  <p className="text-sm text-muted-foreground">
                    Listings are displayed prominently on the homepage for maximum visibility.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Category Feature</h3>
                  <p className="text-sm text-muted-foreground">
                    Listings are featured at the top of their respective category pages.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Premium Feature</h3>
                  <p className="text-sm text-muted-foreground">
                    Listings get maximum exposure by being featured on both homepage and category pages.
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium">Free Feature Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Each user gets 3 free feature requests. After that, they need to pay for featuring their listings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="coupons" className="space-y-4">
          <Card className="col-span-3 mb-4">
            <CardHeader>
              <CardTitle>Coupon Code Management</CardTitle>
              <CardDescription>
                Create and manage discount coupons for featuring listings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Create coupon codes for special promotions or discounts on feature purchases.
                Set validity periods, usage limits, and discount values.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            <CouponManagementCard />
            
            <Card>
              <CardHeader>
                <CardTitle>Active Coupons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coming soon: View and manage all active coupon codes, their usage stats, and expiration dates.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
              <CardDescription>
                Configure global settings for the feature system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon: Adjust free feature limits, approval workflows, and more settings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
