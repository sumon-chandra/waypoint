"use client";

import * as React from "react";
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  Layers,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  BANGLADESH_DIVISIONS,
  getAllDistricts,
  getDistrictsByDivision,
  getUpazilasByDistrict,
  getDivisionByDistrict,
} from "@/config/bangladesh-geo";
import { useCreateHub } from "../api/useCreateHub";
import { useUpdateHub } from "../api/useUpdateHub";
import { createHubSchema } from "../schemas/createHubSchema";
import type { Hub, HubStatus, CreateHubBody } from "@/types";
import { toast } from "sonner";

interface HubDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hubToEdit?: Hub | null;
  onSuccess?: () => void;
}

export function HubDialog({
  open,
  onOpenChange,
  hubToEdit,
  onSuccess,
}: HubDialogProps) {
  const isEdit = Boolean(hubToEdit);

  const createMutation = useCreateHub();
  const updateMutation = useUpdateHub();

  // Form State
  const [code, setCode] = React.useState(hubToEdit?.code || "");
  const [name, setName] = React.useState(hubToEdit?.name || "");
  const [division, setDivision] = React.useState(hubToEdit?.division || "Dhaka");
  const [district, setDistrict] = React.useState(hubToEdit?.district || "Dhaka");
  const [upazila, setUpazila] = React.useState(hubToEdit?.upazila || "");
  const [address, setAddress] = React.useState(hubToEdit?.address || "");
  const [cutoff, setCutoff] = React.useState(hubToEdit?.cutoff || "18:00");
  const [capacity, setCapacity] = React.useState(hubToEdit?.capacity || 2000);
  const [phone, setPhone] = React.useState(hubToEdit?.phone || "017");
  const [isGateway, setIsGateway] = React.useState(hubToEdit?.isGateway || false);
  const [status, setStatus] = React.useState<HubStatus>(
    hubToEdit?.status || "ACTIVE"
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Sync state when editing or opening
  React.useEffect(() => {
    if (open) {
      if (hubToEdit) {
        setCode(hubToEdit.code);
        setName(hubToEdit.name);
        setDivision(hubToEdit.division);
        setDistrict(hubToEdit.district);
        setUpazila(hubToEdit.upazila);
        setAddress(hubToEdit.address);
        setCutoff(hubToEdit.cutoff);
        setCapacity(hubToEdit.capacity);
        setPhone(hubToEdit.phone);
        setIsGateway(hubToEdit.isGateway);
        setStatus(hubToEdit.status);
      } else {
        setCode("");
        setName("");
        setDivision("Dhaka");
        setDistrict("Dhaka");
        setUpazila("");
        setAddress("");
        setCutoff("18:00");
        setCapacity(2000);
        setPhone("");
        setIsGateway(false);
        setStatus("ACTIVE");
      }
      setErrors({});
    }
  }, [open, hubToEdit]);

  // Available districts for selected division
  const availableDistricts = React.useMemo(() => {
    return getDistrictsByDivision(division);
  }, [division]);

  // Available upazilas for selected district
  const availableUpazilas = React.useMemo(() => {
    return getUpazilasByDistrict(district);
  }, [district]);

  // Handle Division change
  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    const districts = getDistrictsByDivision(newDivision);
    const firstDistrict = districts[0] || "";
    setDistrict(firstDistrict);
    const upazilas = getUpazilasByDistrict(firstDistrict);
    setUpazila(upazilas[0] || "");
  };

  // Handle District change
  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const matchedDivision = getDivisionByDistrict(newDistrict);
    if (matchedDivision) setDivision(matchedDivision);
    const upazilas = getUpazilasByDistrict(newDistrict);
    setUpazila(upazilas[0] || "");
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateHubBody = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      division,
      district,
      upazila,
      address: address.trim(),
      cutoff: cutoff.trim(),
      capacity: Number(capacity),
      phone: phone.trim(),
      isGateway,
      status,
    };

    // Validate using Zod
    const validation = createHubSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error(
        validation.error.issues[0]?.message || "Please fix validation errors."
      );
      return;
    }

    setErrors({});

    try {
      if (isEdit && hubToEdit) {
        await updateMutation.mutateAsync({
          id: hubToEdit.id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-6 rounded-3xl border border-border/80 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Building2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {isEdit ? "Edit Sorting Hub Facility" : "Register New Sorting Hub"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configure facility throughput, geographic jurisdiction, and cutoff time.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Row 1: Code & Facility Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="hubCode" className="text-xs font-semibold">
                Hub Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hubCode"
                placeholder="e.g. DHK-01"
                maxLength={10}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="mt-1 font-mono uppercase"
              />
              {errors.code && (
                <p className="text-[11px] text-destructive mt-1">{errors.code}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="hubName" className="text-xs font-semibold">
                Facility Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hubName"
                placeholder="e.g. Dhaka Central Sorting Hub"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Row 2: Division & District & Upazila */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="hubDivision" className="text-xs font-semibold">
                Division <span className="text-destructive">*</span>
              </Label>
              <Select
                id="hubDivision"
                value={division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="mt-1 text-xs"
              >
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="hubDistrict" className="text-xs font-semibold">
                District <span className="text-destructive">*</span>
              </Label>
              <Select
                id="hubDistrict"
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="mt-1 text-xs"
              >
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="hubUpazila" className="text-xs font-semibold">
                Upazila / Thana <span className="text-destructive">*</span>
              </Label>
              <Select
                id="hubUpazila"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="mt-1 text-xs"
              >
                {availableUpazilas.length === 0 ? (
                  <option value="">No Upazilas</option>
                ) : (
                  availableUpazilas.map((upz) => (
                    <option key={upz} value={upz}>
                      {upz}
                    </option>
                  ))
                )}
              </Select>
              {errors.upazila && (
                <p className="text-[11px] text-destructive mt-1">{errors.upazila}</p>
              )}
            </div>
          </div>

          {/* Row 3: Street Address */}
          <div>
            <Label htmlFor="hubAddress" className="text-xs font-semibold">
              Full Facility Street Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="hubAddress"
              rows={2}
              placeholder="Plot #, Road #, Industrial Sector / Zone, Landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 text-xs"
            />
            {errors.address && (
              <p className="text-[11px] text-destructive mt-1">{errors.address}</p>
            )}
          </div>

          {/* Row 4: Cutoff Time, Capacity, Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="hubCutoff" className="text-xs font-semibold">
                Cutoff Time (HH:mm) <span className="text-destructive">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="hubCutoff"
                  type="text"
                  placeholder="18:00"
                  maxLength={5}
                  value={cutoff}
                  onChange={(e) => setCutoff(e.target.value)}
                  className="font-mono"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              </div>
              {errors.cutoff && (
                <p className="text-[11px] text-destructive mt-1">{errors.cutoff}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hubCapacity" className="text-xs font-semibold">
                Capacity (pkgs) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hubCapacity"
                type="number"
                min={100}
                step={50}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="mt-1 font-mono"
              />
              {errors.capacity && (
                <p className="text-[11px] text-destructive mt-1">{errors.capacity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hubPhone" className="text-xs font-semibold">
                Facility Phone <span className="text-destructive">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="hubPhone"
                  type="text"
                  maxLength={11}
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-destructive mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Row 5: Status & Gateway Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <Label htmlFor="hubStatus" className="text-xs font-semibold">
                Operational Status
              </Label>
              <Select
                id="hubStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as HubStatus)}
                className="mt-1 text-xs"
              >
                <option value="ACTIVE">ACTIVE (Operational)</option>
                <option value="MAINTENANCE">MAINTENANCE (Temporary Pause)</option>
                <option value="INACTIVE">INACTIVE (Decommissioned)</option>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                id="hubGateway"
                type="checkbox"
                checked={isGateway}
                onChange={(e) => setIsGateway(e.target.checked)}
                className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <Label
                htmlFor="hubGateway"
                className="text-xs font-semibold cursor-pointer select-none"
              >
                Divisional Gateway Hub (Line-Haul Anchor)
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>{isEdit ? "Update Hub" : "Register Hub"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
