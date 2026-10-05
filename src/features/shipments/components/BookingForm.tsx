"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import {
  Package,
  MapPin,
  User,
  Phone,
  Truck,
  CreditCard,
  Banknote,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PayNowButton } from "@/features/payments/components/PayNowButton";
import {
  getAllDistricts,
  getUpazilasByDistrict,
} from "@/config/bangladesh-geo";
import {
  createShipmentSchema,
  BD_PHONE_REGEX,
  type CreateShipmentFormValues,
} from "../schemas/createShipmentSchema";
import { useCreateShipment } from "../api/useCreateShipment";
import type { Shipment, DeliveryType, PaymentType } from "@/types";
import { cn } from "@/lib/utils";

export function BookingForm() {
  const router = useRouter();
  const createShipmentMutation = useCreateShipment();

  // Dialog state for post-booking success
  const [createdShipment, setCreatedShipment] = React.useState<Shipment | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);
  const [copiedTracking, setCopiedTracking] = React.useState(false);

  // Geographic district lists
  const allDistricts = React.useMemo(() => getAllDistricts(), []);

  const form = useForm({
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      weightKg: 1,
      deliveryType: "LOCAL" as DeliveryType,
      paymentType: "CASH" as PaymentType,
      codAmount: 0,
      senderAddress: "",
      senderDistrict: "Dhaka",
      senderUpazila: "",
      receiverAddress: "",
      receiverDistrict: "Dhaka",
      receiverUpazila: "",
    },
    onSubmit: async ({ value }) => {
      // Validate with Zod
      const validation = createShipmentSchema.safeParse(value);
      if (!validation.success) {
        const firstError = validation.error.issues[0]?.message || "Validation failed";
        toast.error(firstError);
        return;
      }

      try {
        const payload = {
          ...validation.data,
          codAmount:
            validation.data.paymentType === "CASH"
              ? Number(validation.data.codAmount)
              : undefined,
        };

        const result = await createShipmentMutation.mutateAsync(payload);
        setCreatedShipment(result);
        setSuccessDialogOpen(true);
      } catch (err: unknown) {
        // Handled in mutation onError
      }
    },
  });

  const handleCopyTracking = () => {
    if (!createdShipment?.trackingNumber) return;
    navigator.clipboard.writeText(createdShipment.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* SECTION 1: Sender Origin */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <MapPin className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                1. Sender & Origin Location
              </h2>
              <p className="text-xs text-muted-foreground">
                Pickup address where the waypoint courier will collect the consignment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sender District */}
            <form.Field name="senderDistrict">
              {(field) => {
                return (
                  <div className="space-y-2">
                    <Label htmlFor="senderDistrict" className="text-xs font-semibold">
                      Sender District <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      id="senderDistrict"
                      value={field.state.value}
                      onChange={(e) => {
                        const newDistrict = e.target.value;
                        field.handleChange(newDistrict);
                        // Reset upazila when district changes
                        form.setFieldValue("senderUpazila", "");
                      }}
                    >
                      <option value="" disabled>
                        Select District
                      </option>
                      {allDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </Select>
                  </div>
                );
              }}
            </form.Field>

            {/* Sender Upazila / Thana */}
            <form.Field name="senderUpazila">
              {(field) => {
                const currentDistrict = form.getFieldValue("senderDistrict");
                const availableUpazilas = getUpazilasByDistrict(currentDistrict);

                return (
                  <div className="space-y-2">
                    <Label htmlFor="senderUpazila" className="text-xs font-semibold">
                      Sender Upazila / Thana <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      id="senderUpazila"
                      value={field.state.value}
                      disabled={!currentDistrict || availableUpazilas.length === 0}
                      onChange={(e) => field.handleChange(e.target.value)}
                    >
                      <option value="">
                        {availableUpazilas.length === 0
                          ? "Select a district first"
                          : "Select Upazila / Thana"}
                      </option>
                      {availableUpazilas.map((upz) => (
                        <option key={upz} value={upz}>
                          {upz}
                        </option>
                      ))}
                    </Select>
                  </div>
                );
              }}
            </form.Field>

            {/* Sender Street Address */}
            <div className="md:col-span-2 space-y-2">
              <form.Field name="senderAddress">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="senderAddress" className="text-xs font-semibold">
                      Sender Full Street Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="senderAddress"
                      placeholder="House/Plot #, Road #, Sector/Area, Landmark..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        {/* SECTION 2: Recipient Destination */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="size-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                2. Recipient & Destination Details
              </h2>
              <p className="text-xs text-muted-foreground">
                Final recipient details for milestone verification and delivery handoff.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Receiver Name */}
            <form.Field name="receiverName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="receiverName" className="text-xs font-semibold">
                    Recipient Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="receiverName"
                    placeholder="e.g. Tanvir Ahmed"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            {/* Receiver Phone */}
            <form.Field name="receiverPhone">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="receiverPhone" className="text-xs font-semibold">
                    Recipient Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="receiverPhone"
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    11-digit Bangladeshi mobile number for delivery OTP verification.
                  </p>
                </div>
              )}
            </form.Field>

            {/* Receiver District */}
            <form.Field name="receiverDistrict">
              {(field) => {
                return (
                  <div className="space-y-2">
                    <Label htmlFor="receiverDistrict" className="text-xs font-semibold">
                      Recipient District <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      id="receiverDistrict"
                      value={field.state.value}
                      onChange={(e) => {
                        const newDistrict = e.target.value;
                        field.handleChange(newDistrict);
                        form.setFieldValue("receiverUpazila", "");

                        // Auto-toggle delivery type if districts differ
                        const senderDistrict = form.getFieldValue("senderDistrict");
                        if (senderDistrict && newDistrict) {
                          if (senderDistrict === newDistrict) {
                            form.setFieldValue("deliveryType", "LOCAL");
                          } else {
                            form.setFieldValue("deliveryType", "INTER_DISTRICT");
                          }
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select District
                      </option>
                      {allDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </Select>
                  </div>
                );
              }}
            </form.Field>

            {/* Receiver Upazila / Thana */}
            <form.Field name="receiverUpazila">
              {(field) => {
                const currentDistrict = form.getFieldValue("receiverDistrict");
                const availableUpazilas = getUpazilasByDistrict(currentDistrict);

                return (
                  <div className="space-y-2">
                    <Label htmlFor="receiverUpazila" className="text-xs font-semibold">
                      Recipient Upazila / Thana <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      id="receiverUpazila"
                      value={field.state.value}
                      disabled={!currentDistrict || availableUpazilas.length === 0}
                      onChange={(e) => field.handleChange(e.target.value)}
                    >
                      <option value="">
                        {availableUpazilas.length === 0
                          ? "Select a district first"
                          : "Select Upazila / Thana"}
                      </option>
                      {availableUpazilas.map((upz) => (
                        <option key={upz} value={upz}>
                          {upz}
                        </option>
                      ))}
                    </Select>
                  </div>
                );
              }}
            </form.Field>

            {/* Receiver Street Address */}
            <div className="md:col-span-2 space-y-2">
              <form.Field name="receiverAddress">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="receiverAddress" className="text-xs font-semibold">
                      Recipient Delivery Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="receiverAddress"
                      placeholder="Apartment/Flat #, Building Name, Road #, Landmark..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        {/* SECTION 3: Package & Delivery Type */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="size-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Package className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                3. Parcel & Route Configuration
              </h2>
              <p className="text-xs text-muted-foreground">
                Delivery routing classification and parcel weight.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Delivery Type Segmented Cards */}
            <form.Field name="deliveryType">
              {(field) => (
                <div className="space-y-3">
                  <Label className="text-xs font-semibold">
                    Delivery Classification <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => field.handleChange("LOCAL")}
                      className={cn(
                        "rounded-2xl border p-4 cursor-pointer transition-all flex items-start gap-3 select-none",
                        field.state.value === "LOCAL"
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                          : "border-border hover:border-border/80 hover:bg-muted/30"
                      )}
                    >
                      <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Truck className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            Local Delivery
                          </span>
                          <Badge variant="outline" className="text-[10px] py-0">
                            Intra-District
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Direct intra-district delivery routed via local city sorting hub (5 milestones).
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => field.handleChange("INTER_DISTRICT")}
                      className={cn(
                        "rounded-2xl border p-4 cursor-pointer transition-all flex items-start gap-3 select-none",
                        field.state.value === "INTER_DISTRICT"
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                          : "border-border hover:border-border/80 hover:bg-muted/30"
                      )}
                    >
                      <div className="size-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Truck className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            Inter-District Line-Haul
                          </span>
                          <Badge variant="secondary" className="text-[10px] py-0">
                            Nationwide
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Highway line-haul transit across origin & destination divisional hubs (8 milestones).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form.Field>

            {/* Weight Input */}
            <form.Field name="weightKg">
              {(field) => (
                <div className="space-y-2 max-w-sm">
                  <Label htmlFor="weightKg" className="text-xs font-semibold">
                    Consignment Weight (kg) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="weightKg"
                      type="number"
                      min={0.1}
                      max={100}
                      step={0.1}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                      KG
                    </span>
                  </div>
                </div>
              )}
            </form.Field>
          </div>
        </div>

        {/* SECTION 4: Payment Selection */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                4. Billing & Payment Method
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose prepaid card checkout with Stripe or Cash on Delivery (COD).
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <form.Field name="paymentType">
              {(field) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CASH / COD */}
                  <div
                    onClick={() => field.handleChange("CASH")}
                    className={cn(
                      "rounded-2xl border p-4 cursor-pointer transition-all flex items-start gap-3 select-none",
                      field.state.value === "CASH"
                        ? "border-emerald-500 bg-emerald-500/5 shadow-xs ring-1 ring-emerald-500"
                        : "border-border hover:border-border/80 hover:bg-muted/30"
                    )}
                  >
                    <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Banknote className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          Cash on Delivery (COD)
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                          Cash Collection
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Courier collects the designated amount from the recipient upon final delivery.
                      </p>
                    </div>
                  </div>

                  {/* CARD / Stripe */}
                  <div
                    onClick={() => field.handleChange("CARD")}
                    className={cn(
                      "rounded-2xl border p-4 cursor-pointer transition-all flex items-start gap-3 select-none",
                      field.state.value === "CARD"
                        ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                        : "border-border hover:border-border/80 hover:bg-muted/30"
                    )}
                  >
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <CreditCard className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          Prepaid Card (Stripe)
                        </span>
                        <Badge variant="default" className="text-[10px] py-0">
                          Instant
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Authorize instantly with Visa, Mastercard, or American Express via Stripe checkout.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form.Field>

            {/* Conditional COD Amount Field */}
            {form.getFieldValue("paymentType") === "CASH" && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 space-y-3 animate-in fade-in-0 duration-200">
                <form.Field name="codAmount">
                  {(field) => (
                    <div className="space-y-2 max-w-sm">
                      <Label htmlFor="codAmount" className="text-xs font-semibold text-foreground">
                        Cash on Delivery Amount (BDT ৳) <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                          ৳
                        </span>
                        <Input
                          id="codAmount"
                          type="number"
                          min={1}
                          placeholder="e.g. 1500"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          className="pl-8"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Our courier rider will collect this exact amount from the recipient upon delivery before releasing OTP.
                      </p>
                    </div>
                  )}
                </form.Field>
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-foreground">
              Ready to generate digital waybill?
            </span>
            <p className="text-[11px] text-muted-foreground">
              Waypoint guarantees milestone tracking and live courier telemetry across all 64 districts.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/customer"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-xl w-full sm:w-auto font-medium"
              )}
            >
              Cancel
            </Link>

            <Button
              type="submit"
              size="default"
              disabled={createShipmentMutation.isPending}
              className="rounded-xl w-full sm:w-auto gap-2 font-bold px-6 shadow-xs cursor-pointer"
            >
              {createShipmentMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Registering Consignment...</span>
                </>
              ) : (
                <>
                  <span>Book Consignment</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* POST-BOOKING SUCCESS CONFIRMATION MODAL */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <div className="mx-auto size-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 mb-2">
              <CheckCircle2 className="size-8" />
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl font-black">
              Consignment Registered!
            </DialogTitle>
            <DialogDescription className="text-center text-xs sm:text-sm">
              Your parcel booking has been logged into the Waypoint routing mesh.
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
                    {createdShipment.receiverName} ({createdShipment.receiverPhone})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Route</span>
                  <span className="font-semibold text-foreground">
                    {createdShipment.senderDistrict} → {createdShipment.receiverDistrict}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Classification</span>
                  <Badge variant="outline" className="text-[10px]">
                    {createdShipment.deliveryType === "LOCAL" ? "Local" : "Inter-District"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-bold text-foreground">
                    {createdShipment.paymentType === "CARD" ? "Card (Stripe)" : "Cash on Delivery"}
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
                    Click the button below to open the secure Stripe checkout gateway and finalize your parcel.
                  </p>
                  <PayNowButton
                    shipmentId={createdShipment.id}
                    label="Pay Now with Stripe"
                    size="lg"
                    className="w-full rounded-xl"
                  />
                </div>
              )}

              {/* CASH PAYMENT CONFIRMATION */}
              {createdShipment.paymentType === "CASH" && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Cash collection of ৳{createdShipment.codAmount?.toLocaleString()} will be handled by our courier at delivery.
                </div>
              )}

              {/* Dialog Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link
                  href={`/customer/tracking?id=${encodeURIComponent(createdShipment.trackingNumber)}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "rounded-xl w-full gap-1.5 font-medium"
                  )}
                >
                  <Truck className="size-4" />
                  <span>Track Live</span>
                </Link>

                <Link
                  href="/customer/shipments"
                  className={cn(
                    buttonVariants({ variant: "default", size: "default" }),
                    "rounded-xl w-full gap-1.5 font-semibold"
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
    </div>
  );
}
