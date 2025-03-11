
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";

interface FeatureSuccessProps {
  invoiceUrl: string | null;
  onDownloadInvoice: () => void;
}

export default function FeatureSuccess({ invoiceUrl, onDownloadInvoice }: FeatureSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="bg-green-100 p-3 rounded-full mb-4">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Request Submitted!</h2>
      <p className="text-center text-muted-foreground mb-6">
        Your free featured listing will be active soon after admin review.
      </p>
      
      {invoiceUrl && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2 mb-4"
          onClick={onDownloadInvoice}
        >
          <Download className="h-4 w-4" /> Download Invoice
        </Button>
      )}
    </div>
  );
}
