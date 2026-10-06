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
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Receipt,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  getAllDistricts,
  getUpazilasByDistrict,
} from "@/config/bangladesh-geo";
import {
  senderGroupSchema,
  receiverGroupSchema,
  parcelGroupSchema,
  billingGroupSchema,
  calculateDeliveryCost,
} from "../../schemas/createShipmentSchema";
import { useCreateShipment } from "../../api/useCreateShipment";
import type {
  Shipment,
  DeliveryType,
  PaymentType,
  CreateShipmentBody,
} from "@/types";
import { cn } from "@/lib/utils";
import BookingConfirmationModal from "./BookingConfirmationModal";
import { FormHeaderStageButton } from "./FormHeaderStageButton";

const STAGES = [
  { id: 0, title: "Origin", label: "Sender & Pickup", icon: MapPin },
  { id: 1, title: "Destination", label: "Recipient Details", icon: User },
  { id: 2, title: "Parcel", label: "Consignment Weight", icon: Package },
  { id: 3, title: "Billing", label: "Payment & Review", icon: CreditCard },
];

export function BookingForm() {
  const router = useRouter();
  const createShipmentMutation = useCreateShipment();

  // Multi-stage navigation state: 0 = Origin, 1 = Destination, 2 = Parcel, 3 = Billing
  const [currentStage, setCurrentStage] = React.useState<number>(0);

  // Dialog state for post-booking success
  const [createdShipment, setCreatedShipment] = React.useState<Shipment | null>(
    null,
  );
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);

  // Geographic district lists
  const allDistricts = React.useMemo(() => getAllDistricts(), []);

  // Initialize TanStack Form with grouped form data structure
  const form = useForm({
    defaultValues: {
      sender: {
        address: "",
        district: "Dhaka",
        upazila: "",
      },
      receiver: {
        name: "",
        phone: "",
        address: "",
        district: "Dhaka",
        upazila: "",
      },
      parcel: {
        weightKg: 1,
        deliveryType: "LOCAL" as DeliveryType,
      },
      billing: {
        paymentType: "CASH" as PaymentType,
      },
    },
    onSubmit: async ({ value }) => {
      // Calculate delivery cost matching backend logic
      const { totalAmount } = calculateDeliveryCost(value.parcel.weightKg);

      // Auto-calculate delivery route classification based on sender and receiver districts
      const senderDist = value.sender.district?.trim().toLowerCase();
      const receiverDist = value.receiver.district?.trim().toLowerCase();
      const isLocal = Boolean(
        senderDist && receiverDist && senderDist === receiverDist,
      );
      const calculatedDeliveryType: DeliveryType = isLocal
        ? "LOCAL"
        : "INTER_DISTRICT";

      const payload: CreateShipmentBody = {
        senderAddress: value.sender.address,
        senderDistrict: value.sender.district,
        senderUpazila: value.sender.upazila,
        receiverName: value.receiver.name,
        receiverPhone: value.receiver.phone,
        receiverAddress: value.receiver.address,
        receiverDistrict: value.receiver.district,
        receiverUpazila: value.receiver.upazila,
        weightKg: value.parcel.weightKg,
        deliveryType: calculatedDeliveryType,
        paymentType: value.billing.paymentType,
        codAmount:
          value.billing.paymentType === "CASH" ? totalAmount : undefined,
      };

      try {
        const result = await createShipmentMutation.mutateAsync(payload);
        setCreatedShipment(result);
        setSuccessDialogOpen(true);
      } catch (err: unknown) {
        // Handled in mutation onError
      }
    },
  });

  // Stage validation before advancing to the next stage
  const handleNextStage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (currentStage === 0) {
      const senderData = form.getFieldValue("sender");
      const validation = senderGroupSchema.safeParse(senderData);
      if (!validation.success) {
        toast.error(
          validation.error.issues[0]?.message ||
            "Please fill in all sender details",
        );
        return;
      }
    } else if (currentStage === 1) {
      const receiverData = form.getFieldValue("receiver");
      const validation = receiverGroupSchema.safeParse(receiverData);
      if (!validation.success) {
        toast.error(
          validation.error.issues[0]?.message ||
            "Please fill in all recipient details",
        );
        return;
      }
    } else if (currentStage === 2) {
      const parcelData = form.getFieldValue("parcel");
      const validation = parcelGroupSchema.safeParse(parcelData);
      if (!validation.success) {
        toast.error(
          validation.error.issues[0]?.message ||
            "Please specify valid parcel details",
        );
        return;
      }
    }

    if (currentStage < STAGES.length - 1) {
      setCurrentStage((prev) => prev + 1);
    }
  };

  // Only called when user explicitly clicks "Confirm & Book Consignment" on Stage 3 (Billing)
  const handleConfirmAndBook = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (currentStage !== 3) return;

    const billingData = form.getFieldValue("billing");
    const validation = billingGroupSchema.safeParse(billingData);
    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please select a valid payment method",
      );
      return;
    }

    await form.handleSubmit();
  };

  const handlePrevStage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentStage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-8">
      {/* MULTI-STAGE STEPPER HEADER */}
      <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStage;
            const isCurrent = idx === currentStage;

            return (
              <FormHeaderStageButton
                stage={stage}
                idx={idx}
                currentStage={currentStage}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                setCurrentStage={setCurrentStage}
              />
            );
          })}
        </div>
      </div>

      {/* FORM CONTAINER */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="space-y-8"
      >
        {/* STAGE 0: SENDER & ORIGIN FORM GROUP */}
        {currentStage === 0 && (
          <form.FormGroup name="sender">
            {() => (
              <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-0 duration-200">
                <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                  <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Stage 1: Sender & Origin Location
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Specify the pickup address where our courier will collect
                      the parcel.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Sender District */}
                  <form.Field name="sender.district">
                    {(field) => (
                      <div className="space-y-2">
                        <Label
                          htmlFor="senderDistrict"
                          className="text-xs font-semibold"
                        >
                          Sender District{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          id="senderDistrict"
                          value={field.state.value}
                          onChange={(e) => {
                            const newDistrict = e.target.value;
                            field.handleChange(newDistrict);
                            form.setFieldValue("sender.upazila", "");

                            // Auto-set routing if sender and receiver districts are selected
                            const receiverDistrict =
                              form.getFieldValue("receiver.district");
                            if (newDistrict && receiverDistrict) {
                              const isSame =
                                newDistrict.trim().toLowerCase() ===
                                receiverDistrict.trim().toLowerCase();
                              form.setFieldValue(
                                "parcel.deliveryType",
                                isSame ? "LOCAL" : "INTER_DISTRICT",
                              );
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
                    )}
                  </form.Field>

                  {/* Sender Upazila */}
                  <form.Field name="sender.upazila">
                    {(field) => {
                      const currentDistrict =
                        form.getFieldValue("sender.district");
                      const availableUpazilas =
                        getUpazilasByDistrict(currentDistrict);

                      return (
                        <div className="space-y-2">
                          <Label
                            htmlFor="senderUpazila"
                            className="text-xs font-semibold"
                          >
                            Sender Upazila / Thana{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            id="senderUpazila"
                            value={field.state.value}
                            disabled={
                              !currentDistrict || availableUpazilas.length === 0
                            }
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
                    <form.Field name="sender.address">
                      {(field) => (
                        <div className="space-y-2">
                          <Label
                            htmlFor="senderAddress"
                            className="text-xs font-semibold"
                          >
                            Full Street Address & Landmark{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="senderAddress"
                            placeholder="Building/Plot #, Road #, Area/Sector, Landmark notes..."
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            rows={3}
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              </div>
            )}
          </form.FormGroup>
        )}

        {/* STAGE 1: RECIPIENT & DESTINATION FORM GROUP */}
        {currentStage === 1 && (
          <form.FormGroup name="receiver">
            {() => (
              <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-0 duration-200">
                <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                  <div className="size-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <User className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Stage 2: Recipient & Destination Details
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Who will receive the parcel and where should it be
                      delivered?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Receiver Name */}
                  <form.Field name="receiver.name">
                    {(field) => (
                      <div className="space-y-2">
                        <Label
                          htmlFor="receiverName"
                          className="text-xs font-semibold"
                        >
                          Recipient Full Name{" "}
                          <span className="text-destructive">*</span>
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
                  <form.Field name="receiver.phone">
                    {(field) => (
                      <div className="space-y-2">
                        <Label
                          htmlFor="receiverPhone"
                          className="text-xs font-semibold"
                        >
                          Recipient Phone Number{" "}
                          <span className="text-destructive">*</span>
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
                          11-digit Bangladeshi mobile number for handover OTP
                          verification.
                        </p>
                      </div>
                    )}
                  </form.Field>

                  {/* Receiver District */}
                  <form.Field name="receiver.district">
                    {(field) => (
                      <div className="space-y-2">
                        <Label
                          htmlFor="receiverDistrict"
                          className="text-xs font-semibold"
                        >
                          Recipient District{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          id="receiverDistrict"
                          value={field.state.value}
                          onChange={(e) => {
                            const newDistrict = e.target.value;
                            field.handleChange(newDistrict);
                            form.setFieldValue("receiver.upazila", "");

                            // Auto-set routing if sender and receiver districts are selected
                            const senderDistrict =
                              form.getFieldValue("sender.district");
                            if (senderDistrict && newDistrict) {
                              const isSame =
                                senderDistrict.trim().toLowerCase() ===
                                newDistrict.trim().toLowerCase();
                              form.setFieldValue(
                                "parcel.deliveryType",
                                isSame ? "LOCAL" : "INTER_DISTRICT",
                              );
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
                    )}
                  </form.Field>

                  {/* Receiver Upazila */}
                  <form.Field name="receiver.upazila">
                    {(field) => {
                      const currentDistrict =
                        form.getFieldValue("receiver.district");
                      const availableUpazilas =
                        getUpazilasByDistrict(currentDistrict);

                      return (
                        <div className="space-y-2">
                          <Label
                            htmlFor="receiverUpazila"
                            className="text-xs font-semibold"
                          >
                            Recipient Upazila / Thana{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            id="receiverUpazila"
                            value={field.state.value}
                            disabled={
                              !currentDistrict || availableUpazilas.length === 0
                            }
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
                    <form.Field name="receiver.address">
                      {(field) => (
                        <div className="space-y-2">
                          <Label
                            htmlFor="receiverAddress"
                            className="text-xs font-semibold"
                          >
                            Recipient Delivery Address{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="receiverAddress"
                            placeholder="Flat/House #, Road #, Area/Neighborhood, Landmark..."
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            rows={3}
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              </div>
            )}
          </form.FormGroup>
        )}

        {/* STAGE 2: PARCEL FORM GROUP */}
        {currentStage === 2 && (
          <form.FormGroup name="parcel">
            {() => {
              const senderDistrict =
                form.getFieldValue("sender.district") || "";
              const receiverDistrict =
                form.getFieldValue("receiver.district") || "";
              const isSameDistrict =
                Boolean(senderDistrict && receiverDistrict) &&
                senderDistrict.trim().toLowerCase() ===
                  receiverDistrict.trim().toLowerCase();

              return (
                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-0 duration-200">
                  <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                    <div className="size-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <Package className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-foreground">
                        Stage 3: Consignment Parcel Weight
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Specify parcel weight. Routing is calculated
                        automatically from origin and destination hubs.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Automated Route Classification Card (Read-only) */}
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold">
                        Automated Route Classification
                      </Label>
                      <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 sm:p-5 flex items-start gap-3.5">
                        <div
                          className={cn(
                            "size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                            isSameDistrict
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
                          )}
                        >
                          <Truck className="size-5" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground">
                              {isSameDistrict
                                ? "Local Delivery"
                                : "Inter-District Delivery"}
                            </span>
                            <Badge
                              variant={isSameDistrict ? "secondary" : "outline"}
                              className={cn(
                                "text-[10px] py-0 font-bold",
                                isSameDistrict
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
                              )}
                            >
                              {isSameDistrict
                                ? "Intra-District"
                                : "Inter-District Line-Haul"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {isSameDistrict
                              ? `Both origin and destination are located in the same district (${senderDistrict || "Same District"}). Routed directly via local sorting hub (5 milestones).`
                              : `Origin (${senderDistrict || "Origin"}) and destination (${receiverDistrict || "Destination"}) are in different districts. Routed via nationwide line-haul transit (8 milestones).`}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 font-medium pt-0.5">
                            <Info className="size-3 text-primary" />
                            <span>
                              Calculated automatically based on your pickup and
                              destination hubs.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weight Input */}
                    <form.Field name="parcel.weightKg">
                      {(field) => (
                        <div className="space-y-2 max-w-sm">
                          <Label
                            htmlFor="weightKg"
                            className="text-xs font-semibold"
                          >
                            Consignment Weight (kg){" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="weightKg"
                              type="number"
                              min={0.1}
                              max={100}
                              step={0.1}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                              KG
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Rate is automatically calculated at ৳100 base + ৳100
                            per kg.
                          </p>
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              );
            }}
          </form.FormGroup>
        )}

        {/* STAGE 3: BILLING & PAYMENT FORM GROUP */}
        {currentStage === 3 && (
          <form.FormGroup name="billing">
            {() => (
              <div className="space-y-6 animate-in fade-in-0 duration-200">
                {/* Payment Method Selector */}
                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                    <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CreditCard className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-foreground">
                        Stage 4: Payment Method & Cost Review
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Select how this delivery will be settled.
                      </p>
                    </div>
                  </div>

                  <form.Field name="billing.paymentType">
                    {(field) => (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* CASH / COD */}
                        <div
                          onClick={() => field.handleChange("CASH")}
                          className={cn(
                            "rounded-2xl border p-4 cursor-pointer transition-all flex items-start gap-3 select-none",
                            field.state.value === "CASH"
                              ? "border-emerald-500 bg-emerald-500/5 shadow-xs ring-1 ring-emerald-500"
                              : "border-border hover:border-border/80 hover:bg-muted/30",
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
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              >
                                Cash Handover
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Courier will collect the calculated delivery
                              amount in cash from recipient.
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
                              : "border-border hover:border-border/80 hover:bg-muted/30",
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
                              <Badge
                                variant="default"
                                className="text-[10px] py-0"
                              >
                                Instant
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Pay securely with card via Stripe right after
                              manifesting.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* AUTOMATIC DELIVERY COST BREAKDOWN CARD */}
                <form.Subscribe
                  selector={(state) => ({
                    values: state.values,
                    weight: state.values.parcel.weightKg || 1,
                    paymentType: state.values.billing.paymentType,
                  })}
                >
                  {({ values, weight, paymentType }) => {
                    const stagePricing = calculateDeliveryCost(weight);
                    return (
                      <div className="space-y-6">
                        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-4">
                          <div className="flex items-center gap-2 text-primary font-bold text-sm">
                            <Receipt className="size-4.5" />
                            <span>Calculated Delivery Fee Breakdown</span>
                          </div>

                          <div className="rounded-2xl border border-border/60 bg-card/80 p-5 space-y-3 text-xs">
                            <div className="flex justify-between items-center text-muted-foreground">
                              <span>Base Delivery Handling Fee</span>
                              <span className="font-semibold text-foreground">
                                ৳{stagePricing.baseFee}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                              <span>
                                Weight Charge ({weight} kg × ৳
                                {stagePricing.perKgRate}/kg)
                              </span>
                              <span className="font-semibold text-foreground">
                                ৳{weight * stagePricing.perKgRate}
                              </span>
                            </div>
                            <div className="border-t border-border/60 pt-3 flex justify-between items-center text-sm font-bold text-foreground">
                              <span>Total Shipment Cost</span>
                              <span className="text-primary text-base font-black">
                                ৳{stagePricing.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Info className="size-4 text-primary shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              {paymentType === "CASH" ? (
                                <>
                                  <strong className="text-foreground">
                                    Cash on Delivery:
                                  </strong>{" "}
                                  Our courier rider will collect exactly{" "}
                                  <strong className="text-primary">
                                    ৳{stagePricing.totalAmount}
                                  </strong>{" "}
                                  in cash upon handing over the parcel.
                                </>
                              ) : (
                                <>
                                  <strong className="text-foreground">
                                    Card Payment:
                                  </strong>{" "}
                                  You will be redirected to the secure Stripe
                                  portal to settle{" "}
                                  <strong className="text-primary">
                                    ৳{stagePricing.totalAmount}
                                  </strong>{" "}
                                  (
                                  {(stagePricing.amountInCents / 100).toFixed(
                                    2,
                                  )}{" "}
                                  BDT).
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* CONSIGNMENT ROUTE PREVIEW */}
                        <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3 text-xs text-muted-foreground">
                          <div className="space-y-1">
                            <span className="font-semibold text-foreground">
                              Summary Overview:
                            </span>
                            <p>
                              From{" "}
                              <strong className="text-foreground">
                                {values.sender.district || "—"}
                              </strong>{" "}
                              ({values.sender.upazila || "—"}) to{" "}
                              <strong className="text-foreground">
                                {values.receiver.district || "—"}
                              </strong>{" "}
                              ({values.receiver.upazila || "—"}) for{" "}
                              <strong className="text-foreground">
                                {values.receiver.name || "—"}
                              </strong>
                              .
                            </p>
                          </div>

                          {/* AUTOMATIC ROUTE CLASSIFICATION MESSAGE BELOW SUMMARY OVERVIEW */}
                          {(() => {
                            const sDist = values.sender.district
                              ?.trim()
                              .toLowerCase();
                            const rDist = values.receiver.district
                              ?.trim()
                              .toLowerCase();
                            const isSameDistrict = Boolean(
                              sDist && rDist && sDist === rDist,
                            );

                            return (
                              <div className="pt-3 border-t border-border/50 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Truck className="size-3.5 text-primary shrink-0" />
                                  <span className="font-semibold text-foreground">
                                    Delivery Route:
                                  </span>
                                  {isSameDistrict ? (
                                    <div className="flex items-center gap-1.5">
                                      <Badge
                                        variant="secondary"
                                        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-bold"
                                      >
                                        Local Delivery
                                      </Badge>
                                      <span className="text-[11px] text-muted-foreground font-medium">
                                        (Intra-District)
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <Badge
                                        variant="outline"
                                        className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold"
                                      >
                                        Inter-District
                                      </Badge>
                                      <span className="text-[11px] text-muted-foreground font-medium">
                                        (Intra-District Cross-Hub Transit)
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                  {isSameDistrict ? (
                                    <>
                                      Customer hubs (districts) are the same (
                                      <strong className="text-foreground">
                                        {values.sender.district}
                                      </strong>
                                      ). Automatically calculated as{" "}
                                      <strong className="text-emerald-600 dark:text-emerald-400">
                                        Local Delivery
                                      </strong>
                                      .
                                    </>
                                  ) : (
                                    <>
                                      Customer hubs (districts) are different (
                                      <strong className="text-foreground">
                                        {values.sender.district}
                                      </strong>{" "}
                                      →{" "}
                                      <strong className="text-foreground">
                                        {values.receiver.district}
                                      </strong>
                                      ). Automatically calculated as{" "}
                                      <strong className="text-indigo-600 dark:text-indigo-400">
                                        Inter-District
                                      </strong>{" "}
                                      (Intra-District cross-hub line-haul).
                                    </>
                                  )}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  }}
                </form.Subscribe>
              </div>
            )}
          </form.FormGroup>
        )}

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
          <div>
            {currentStage > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStage}
                className="rounded-xl gap-2 font-medium w-full sm:w-auto cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Previous Stage</span>
              </Button>
            ) : (
              <Link
                href="/customer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "rounded-xl gap-1.5 font-medium text-xs text-muted-foreground",
                )}
              >
                Cancel and Return
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentStage < 3 ? (
              <Button
                key={`continue-btn-stage-${currentStage}`}
                type="button"
                onClick={handleNextStage}
                className="rounded-xl gap-2 font-bold px-6 w-full sm:w-auto shadow-xs cursor-pointer"
              >
                <span>Continue to {STAGES[currentStage + 1]?.title}</span>
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                key="confirm-booking-btn"
                type="button"
                disabled={createShipmentMutation.isPending}
                onClick={handleConfirmAndBook}
                className="rounded-xl gap-2 font-bold px-8 w-full sm:w-auto shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                {createShipmentMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Booking Consignment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>Confirm & Book Consignment</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* POST-BOOKING SUCCESS CONFIRMATION MODAL */}
      {createdShipment && (
        <BookingConfirmationModal
          createdShipment={createdShipment}
          successDialogOpen={successDialogOpen}
          setSuccessDialogOpen={setSuccessDialogOpen}
        />
      )}
    </div>
  );
}
