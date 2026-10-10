"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Building2,
  PlusCircle,
  Search,
  RotateCw,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Inbox,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { TablePagination } from "@/components/common/TablePagination";
import { useHubs } from "../api/hubs.api";
import { HubDialog } from "./HubDialog";
import { DeleteHubDialog } from "./DeleteHubDialog";
import { BANGLADESH_DIVISIONS } from "@/config/bangladesh-geo";
import type { Hub, HubStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_BADGES: Record<HubStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  MAINTENANCE: {
    label: "Maintenance",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const ITEMS_PER_PAGE = 15;

export function HubManagementTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [divisionFilter, setDivisionFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editHub, setEditHub] = React.useState<Hub | null>(null);
  const [deleteHub, setDeleteHub] = React.useState<Hub | null>(null);

  const { data: hubs = [], isLoading, isRefetching, refetch } = useHubs({
    division: divisionFilter === "ALL" ? undefined : divisionFilter,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  // Client-side search and division/status filtering
  const filteredHubs = React.useMemo(() => {
    let result = hubs;
    if (divisionFilter !== "ALL") {
      result = result.filter((h) => h.division === divisionFilter);
    }
    if (statusFilter !== "ALL") {
      result = result.filter((h) => h.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.code.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q) ||
          h.phone.includes(q)
      );
    }
    return result;
  }, [hubs, divisionFilter, statusFilter, searchQuery]);

  // Pagination calculation
  const totalItems = filteredHubs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedHubs = filteredHubs.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDivisionFilterChange = (newDivision: string) => {
    setDivisionFilter(newDivision);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search hubs by code, name, district, address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentPage !== 1) {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", "1");
                router.push(`${pathname}?${params.toString()}`);
              }
            }}
            className="pl-9 rounded-2xl h-11 text-xs sm:text-sm"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Division Filter */}
          <div className="w-36">
            <Select
              value={divisionFilter}
              onChange={(e) => handleDivisionFilterChange(e.target.value)}
              className="rounded-2xl h-11 text-xs"
            >
              <option value="ALL">All Divisions</option>
              {BANGLADESH_DIVISIONS.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="rounded-2xl h-11 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="rounded-2xl size-11 shrink-0 cursor-pointer"
            title="Refresh hubs"
          >
            <RotateCw
              className={cn("size-4", isRefetching && "animate-spin text-primary")}
            />
          </Button>

          <Button
            type="button"
            onClick={() => setCreateDialogOpen(true)}
            className="rounded-2xl h-11 px-5 font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <PlusCircle className="size-4" />
            <span>Register New Hub</span>
          </Button>
        </div>
      </div>

      {/* Hubs Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground animate-pulse">
          Loading sorting hubs network...
        </div>
      ) : filteredHubs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-4">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Inbox className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              No Hubs Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No sorting hubs matched your query "${searchQuery}".`
                : "No hubs registered under this filter criteria."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setDivisionFilter("ALL");
              setStatusFilter("ALL");
            }}
            className="rounded-xl text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Hub Code</th>
                  <th className="py-3.5 px-4">Facility Name & Contact</th>
                  <th className="py-3.5 px-4">Location Jurisdiction</th>
                  <th className="py-3.5 px-4">Cutoff & Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {paginatedHubs.map((hub) => {
                  const statusInfo = STATUS_BADGES[hub.status] || {
                    label: hub.status,
                    className: "bg-muted text-muted-foreground",
                  };

                  return (
                    <tr
                      key={hub.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-primary shrink-0" />
                          <span className="text-foreground">{hub.code}</span>
                          {hub.isGateway && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] py-0 px-1.5 font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                            >
                              Gateway
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-foreground text-sm">
                          {hub.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {hub.phone}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground">
                            {hub.district}, {hub.division}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                            <MapPin className="size-3 inline mr-1" />
                            {hub.address} ({hub.upazila})
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5 font-mono">
                          <div className="flex items-center gap-1.5 text-foreground font-semibold">
                            <Clock className="size-3 text-muted-foreground" />
                            <span>Cutoff: {hub.cutoff}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Capacity: {hub.capacity.toLocaleString()} pkgs
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] font-bold py-0.5", statusInfo.className)}
                        >
                          {statusInfo.label}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditHub(hub)}
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Edit hub parameters"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteHub(hub)}
                            className="size-8 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Decommission hub"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination (15 items per page) */}
          <TablePagination
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={safeCurrentPage}
            onPageChange={handlePageChange}
            entityLabel="sorting hubs"
          />
        </div>
      )}

      {/* Create / Edit Hub Dialog */}
      {createDialogOpen && (
        <HubDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={() => refetch()}
        />
      )}

      {editHub && (
        <HubDialog
          open={Boolean(editHub)}
          onOpenChange={(open) => {
            if (!open) setEditHub(null);
          }}
          hubToEdit={editHub}
          onSuccess={() => {
            setEditHub(null);
            refetch();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteHub && (
        <DeleteHubDialog
          hub={deleteHub}
          open={Boolean(deleteHub)}
          onOpenChange={(open) => {
            if (!open) setDeleteHub(null);
          }}
          onSuccess={() => {
            setDeleteHub(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
