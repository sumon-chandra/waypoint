import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Copy,
  Truck,
  Package,
  ShieldCheck,
  Check,
} from "lucide-react";
import { PayNowButton } from "@/features/payments/components/PayNowButton";
import { calculateDeliveryCost } from "../schemas/createShipmentSchema";
import type { Shipment, DeliveryType, PaymentType } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface BookingConfirmationModalProps {
  createdShipment: Shipment;
  successDialogOpen: boolean;
  setSuccessDialogOpen: (open: boolean) => void;
}
const BookingConfirmationModal = ({
  createdShipment,
  successDialogOpen,
  setSuccessDialogOpen,
}: BookingConfirmationModalProps) => {
  const [copiedTracking, setCopiedTracking] = React.useState(false);

  const handleCopyTracking = () => {
    if (!createdShipment?.trackingNumber) return;
    navigator.clipboard.writeText(createdShipment.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };
  return (
    <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto size-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 mb-2">
            <CheckCircle2 className="size-8" />
          </div>
          <DialogTitle className="text-center text-xl sm:text-2xl font-black">
            Consignment Booked!
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm">
            Your parcel waybill has been generated into the Waypoint logistics
            network.
          </DialogDescription>
        </DialogHeader>

        {createdShipment && (
          <div className="space-y-4 py-2">
            {/* Tracking Number Card */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center space-y-1.5">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                Waybill Tracking Number
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl font-black font-mono tracking-wider text-foreground">
                  {createdShipment.trackingNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="p-1 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                  title="Copy tracking number"
                >
                  {copiedTracking ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Booking Summary Attributes */}
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-semibold text-foreground">
                  {createdShipment.receiverName} (
                  {createdShipment.receiverPhone})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Route</span>
                <span className="font-semibold text-foreground">
                  {createdShipment.senderDistrict} →{" "}
                  {createdShipment.receiverDistrict}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Fee</span>
                <span className="font-bold text-foreground">
                  ৳
                  {calculateDeliveryCost(
                    createdShipment.weightKg,
                  ).totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-bold text-foreground">
                  {createdShipment.paymentType === "CARD"
                    ? "Card (Stripe)"
                    : "Cash on Delivery"}
                </span>
              </div>
            </div>

            {/* CARD PAYMENT CALL TO ACTION */}
            {createdShipment.paymentType === "CARD" && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-primary text-xs font-semibold">
                  <ShieldCheck className="size-4" />
                  <span>Payment Pending for this Consignment</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Click below to open the secure Stripe checkout gateway and
                  authorize payment.
                </p>
                <PayNowButton
                  shipmentId={createdShipment.id}
                  label={`Pay ৳${calculateDeliveryCost(createdShipment.weightKg).totalAmount.toLocaleString()} with Stripe`}
                  size="lg"
                  className="w-full rounded-xl"
                />
              </div>
            )}

            {/* CASH PAYMENT CONFIRMATION */}
            {createdShipment.paymentType === "CASH" && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Cash collection of ৳
                {calculateDeliveryCost(
                  createdShipment.weightKg,
                ).totalAmount.toLocaleString()}{" "}
                will be handled by our courier at delivery.
              </div>
            )}

            {/* Dialog Footer Actions */}
            <div className="flex gap-2 pt-2">
              <Link
                href={`/customer/tracking?id=${encodeURIComponent(createdShipment.trackingNumber)}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "rounded-xl w-full gap-1.5 font-medium",
                )}
              >
                <Truck className="size-4" />
                <span>Track Live</span>
              </Link>

              <Link
                href="/customer/shipments"
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "rounded-xl w-full gap-1.5 font-semibold",
                )}
              >
                <Package className="size-4" />
                <span>Go to My Shipments</span>
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationModal;
