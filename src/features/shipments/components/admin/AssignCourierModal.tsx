"use client";

import * as React from "react";
import {
  UserCheck,
  Truck,
  Search,
  Loader2,
  CheckCircle2,
  Phone,
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
import { Badge } from "@/components/ui/badge";
import { useAssignCourier } from "../../api/useAssignCourier";
import { useUsers } from "@/features/users/api/useUsers";
import type { Shipment } from "@/types";
import { cn } from "@/lib/utils";

interface AssignCourierModalProps {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignCourierModal({
  shipment,
  open,
  onOpenChange,
  onSuccess,
}: AssignCourierModalProps) {
  const [selectedCourierId, setSelectedCourierId] = React.useState<string>("");
  const [courierSearch, setCourierSearch] = React.useState<string>("");

  const assignMutation = useAssignCourier();

  // Fetch active couriers
  const { data: usersData, isLoading: isCouriersLoading } = useUsers({
    role: "COURIER",
    status: "ACTIVE",
    limit: 100,
  });

  // Strictly filter only active courier accounts (client-side safeguard against backend omitting role filter)
  const couriers = React.useMemo(() => {
    const rawUsers = usersData?.users ?? [];
    return rawUsers.filter((u) => u.role === "COURIER" && u.status === "ACTIVE");
  }, [usersData]);

  // Reset selection when modal opens
  React.useEffect(() => {
    if (open) {
      setSelectedCourierId(shipment?.courierId || "");
      setCourierSearch("");
    }
  }, [open, shipment?.courierId]);

  // Filter couriers by search query
  const filteredCouriers = React.useMemo(() => {
    if (!courierSearch.trim()) return couriers;
    const q = courierSearch.toLowerCase().trim();
    return couriers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.username && c.username.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q))
    );
  }, [couriers, courierSearch]);

  const selectedCourier = couriers.find((c) => c.id === selectedCourierId);

  const handleAssign = async () => {
    if (!shipment || !selectedCourierId) return;

    try {
      await assignMutation.mutateAsync({
        shipmentId: shipment.id,
        courierId: selectedCourierId,
        courierName: selectedCourier?.name,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Handled by mutation hook onError
    }
  };

  if (!shipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl border border-border/80 shadow-2xl space-y-4">
        <DialogHeader className="space-y-1.5 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Assign Dispatch Courier
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Shipment #{shipment.trackingNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {/* Search Couriers */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search couriers by name, email..."
              value={courierSearch}
              onChange={(e) => setCourierSearch(e.target.value)}
              className="pl-8 text-xs h-9 rounded-xl"
            />
          </div>

          {/* Courier Selection List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {isCouriersLoading ? (
              <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">
                Loading active courier riders...
              </div>
            ) : filteredCouriers.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No active courier personnel found.
              </div>
            ) : (
              filteredCouriers.map((courier) => {
                const isSelected = courier.id === selectedCourierId;

                return (
                  <div
                    key={courier.id}
                    onClick={() => setSelectedCourierId(courier.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer transition-all select-none",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                        : "border-border/60 hover:bg-muted/40 hover:border-border"
                    )}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-foreground truncate">
                        {courier.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                        <span className="truncate">{courier.email}</span>
                        {courier.phone && (
                          <span className="inline-flex items-center gap-1 shrink-0 text-foreground/80 font-medium">
                            <Phone className="size-2.5" />
                            <span>{courier.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={isSelected ? "default" : "outline"}
                        className="text-[10px] py-0"
                      >
                        {isSelected ? "Selected" : "Active Rider"}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            disabled={assignMutation.isPending}
            onClick={() => onOpenChange(false)}
            className="rounded-xl cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!selectedCourierId || assignMutation.isPending}
            onClick={handleAssign}
            className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs gap-1.5"
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Assigning...</span>
              </>
            ) : (
              <>
                <UserCheck className="size-4" />
                <span>Confirm Assignment</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
