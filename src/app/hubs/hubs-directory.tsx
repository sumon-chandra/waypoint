"use client";

import * as React from "react";
import {
  Search,
  MapPin,
  Clock,
  Boxes,
  Phone,
  CheckCircle2,
  Building2,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HubInfo {
  code: string;
  name: string;
  district: string;
  division: "Dhaka" | "Chittagong" | "Sylhet" | "Rajshahi" | "Khulna" | "Barishal" | "Rangpur" | "Mymensingh";
  address: string;
  cutoff: string;
  capacity: string;
  phone: string;
  isGateway?: boolean;
}

const hubsData: HubInfo[] = [
  // Dhaka Division
  { code: "HUB-DAC-01", name: "Dhaka Central Gateway", district: "Dhaka", division: "Dhaka", address: "Tejgaon Industrial Area, Dhaka 1208", cutoff: "9:00 PM", capacity: "85,000 / day", phone: "09612-929701", isGateway: true },
  { code: "HUB-DAC-02", name: "Gazipur Industrial Node", district: "Gazipur", division: "Dhaka", address: "Joydebpur Chowrasta, Gazipur", cutoff: "8:00 PM", capacity: "35,000 / day", phone: "09612-929702" },
  { code: "HUB-DAC-03", name: "Narayanganj River Terminal", district: "Narayanganj", division: "Dhaka", address: "Chashara, Narayanganj Sadar", cutoff: "8:00 PM", capacity: "30,000 / day", phone: "09612-929703" },
  { code: "HUB-DAC-04", name: "Tangail Highway Base", district: "Tangail", division: "Dhaka", address: "Old Bus Stand, Tangail Sadar", cutoff: "7:30 PM", capacity: "18,000 / day", phone: "09612-929704" },
  { code: "HUB-DAC-05", name: "Narsingdi Textile Hub", district: "Narsingdi", division: "Dhaka", address: "Velanagar, Narsingdi", cutoff: "7:30 PM", capacity: "16,000 / day", phone: "09612-929705" },
  { code: "HUB-DAC-06", name: "Manikganj Transit Point", district: "Manikganj", division: "Dhaka", address: "Manikganj Bus Stand Road", cutoff: "7:00 PM", capacity: "12,000 / day", phone: "09612-929706" },
  { code: "HUB-DAC-07", name: "Munshiganj Sorting Station", district: "Munshiganj", division: "Dhaka", address: "Mirkadim, Munshiganj", cutoff: "7:00 PM", capacity: "10,000 / day", phone: "09612-929707" },
  { code: "HUB-DAC-08", name: "Faridpur Regional Center", district: "Faridpur", division: "Dhaka", address: "Goalchamot, Faridpur Sadar", cutoff: "7:00 PM", capacity: "15,000 / day", phone: "09612-929708" },
  { code: "HUB-DAC-09", name: "Gopalganj District Base", district: "Gopalganj", division: "Dhaka", address: "Launch Ghat Road, Gopalganj", cutoff: "6:30 PM", capacity: "8,000 / day", phone: "09612-929709" },
  { code: "HUB-DAC-10", name: "Madaripur Sorting Hub", district: "Madaripur", division: "Dhaka", address: "Main Road, Madaripur Sadar", cutoff: "6:30 PM", capacity: "8,000 / day", phone: "09612-929710" },
  { code: "HUB-DAC-11", name: "Shariatpur Transit Hub", district: "Shariatpur", division: "Dhaka", address: "Palong, Shariatpur Sadar", cutoff: "6:30 PM", capacity: "7,500 / day", phone: "09612-929711" },
  { code: "HUB-DAC-12", name: "Rajbari Rail Corridor Hub", district: "Rajbari", division: "Dhaka", address: "Pangsha Road, Rajbari", cutoff: "6:30 PM", capacity: "7,000 / day", phone: "09612-929712" },
  { code: "HUB-DAC-13", name: "Kishoreganj Distribution Base", district: "Kishoreganj", division: "Dhaka", address: "Batali, Kishoreganj Sadar", cutoff: "7:00 PM", capacity: "11,000 / day", phone: "09612-929713" },

  // Chittagong Division
  { code: "HUB-CTG-01", name: "Chittagong Port Terminal", district: "Chittagong", division: "Chittagong", address: "Agrabad Commercial Area, Chittagong", cutoff: "8:30 PM", capacity: "65,000 / day", phone: "09612-929720", isGateway: true },
  { code: "HUB-CTG-02", name: "Cox's Bazar Coastal Hub", district: "Cox's Bazar", division: "Chittagong", address: "Jhawtala, Cox's Bazar Sadar", cutoff: "6:30 PM", capacity: "14,000 / day", phone: "09612-929721" },
  { code: "HUB-CTG-03", name: "Comilla Central Depot", district: "Comilla", division: "Chittagong", address: "Kandirpar, Comilla Sadar", cutoff: "7:30 PM", capacity: "22,000 / day", phone: "09612-929722" },
  { code: "HUB-CTG-04", name: "Feni Highway Junction", district: "Feni", division: "Chittagong", address: "Trunk Road, Feni Sadar", cutoff: "7:00 PM", capacity: "15,000 / day", phone: "09612-929723" },
  { code: "HUB-CTG-05", name: "Brahmanbaria Station", district: "Brahmanbaria", division: "Chittagong", address: "Medda, Brahmanbaria Sadar", cutoff: "7:00 PM", capacity: "13,000 / day", phone: "09612-929724" },
  { code: "HUB-CTG-06", name: "Noakhali Sorting Hub", district: "Noakhali", division: "Chittagong", address: "Maijdee Court, Noakhali", cutoff: "6:30 PM", capacity: "12,000 / day", phone: "09612-929725" },
  { code: "HUB-CTG-07", name: "Chandpur Port Depot", district: "Chandpur", division: "Chittagong", address: "Mission Road, Chandpur", cutoff: "6:30 PM", capacity: "11,000 / day", phone: "09612-929726" },
  { code: "HUB-CTG-08", name: "Lakshmipur Base Hub", district: "Lakshmipur", division: "Chittagong", address: "Hospital Road, Lakshmipur", cutoff: "6:00 PM", capacity: "8,500 / day", phone: "09612-929727" },
  { code: "HUB-CTG-09", name: "Rangamati Hill Node", district: "Rangamati", division: "Chittagong", address: "Reserve Bazar, Rangamati", cutoff: "5:30 PM", capacity: "5,000 / day", phone: "09612-929728" },
  { code: "HUB-CTG-10", name: "Khagrachari Mountain Hub", district: "Khagrachari", division: "Chittagong", address: "Court Road, Khagrachari", cutoff: "5:30 PM", capacity: "4,500 / day", phone: "09612-929729" },
  { code: "HUB-CTG-11", name: "Bandarban Hill Terminal", district: "Bandarban", division: "Chittagong", address: "Traffic Mor, Bandarban", cutoff: "5:00 PM", capacity: "4,000 / day", phone: "09612-929730" },

  // Sylhet Division
  { code: "HUB-SYL-01", name: "Sylhet Express Hub", district: "Sylhet", division: "Sylhet", address: "Zindabazar, Sylhet Sadar", cutoff: "8:00 PM", capacity: "32,000 / day", phone: "09612-929740", isGateway: true },
  { code: "HUB-SYL-02", name: "Moulvibazar Tea Corridor", district: "Moulvibazar", division: "Sylhet", address: "Kusumbag, Moulvibazar", cutoff: "7:00 PM", capacity: "14,000 / day", phone: "09612-929741" },
  { code: "HUB-SYL-03", name: "Habiganj Industrial Hub", district: "Habiganj", division: "Sylhet", address: "Shayestaganj Road, Habiganj", cutoff: "7:00 PM", capacity: "12,000 / day", phone: "09612-929742" },
  { code: "HUB-SYL-04", name: "Sunamganj Haor Base", district: "Sunamganj", division: "Sylhet", address: "Puranpara, Sunamganj", cutoff: "6:00 PM", capacity: "7,000 / day", phone: "09612-929743" },

  // Rajshahi Division
  { code: "HUB-RAJ-01", name: "Rajshahi Logistics Base", district: "Rajshahi", division: "Rajshahi", address: "Shaheb Bazar, Rajshahi Sadar", cutoff: "8:00 PM", capacity: "28,000 / day", phone: "09612-929750", isGateway: true },
  { code: "HUB-RAJ-02", name: "Bogra Commercial Crossdock", district: "Bogra", division: "Rajshahi", address: "Borogola, Bogra Sadar", cutoff: "8:00 PM", capacity: "30,000 / day", phone: "09612-929751" },
  { code: "HUB-RAJ-03", name: "Pabna Regional Hub", district: "Pabna", division: "Rajshahi", address: "Abdul Hamid Road, Pabna", cutoff: "7:00 PM", capacity: "14,000 / day", phone: "09612-929752" },
  { code: "HUB-RAJ-04", name: "Sirajganj Bridge Terminal", district: "Sirajganj", division: "Rajshahi", address: "SS Road, Sirajganj", cutoff: "7:30 PM", capacity: "16,000 / day", phone: "09612-929753" },
  { code: "HUB-RAJ-05", name: "Naogaon Agricultural Hub", district: "Naogaon", division: "Rajshahi", address: "Chowrasta, Naogaon", cutoff: "6:30 PM", capacity: "11,000 / day", phone: "09612-929754" },
  { code: "HUB-RAJ-06", name: "Natore Express Depot", district: "Natore", division: "Rajshahi", address: "Station Road, Natore", cutoff: "6:30 PM", capacity: "10,000 / day", phone: "09612-929755" },
  { code: "HUB-RAJ-07", name: "Chapainawabganj Node", district: "Chapainawabganj", division: "Rajshahi", address: "Shantir Mor, Chapainawabganj", cutoff: "6:00 PM", capacity: "8,000 / day", phone: "09612-929756" },
  { code: "HUB-RAJ-08", name: "Joypurhat Transit Hub", district: "Joypurhat", division: "Rajshahi", address: "Bus Stand, Joypurhat", cutoff: "6:00 PM", capacity: "7,500 / day", phone: "09612-929757" },

  // Khulna Division
  { code: "HUB-KHU-01", name: "Khulna Divisional Hub", district: "Khulna", division: "Khulna", address: "Shibbari Mor, Khulna Sadar", cutoff: "8:00 PM", capacity: "30,000 / day", phone: "09612-929760", isGateway: true },
  { code: "HUB-KHU-02", name: "Jessore Trade Terminal", district: "Jessore", division: "Khulna", address: "Dhopapara, Jessore Sadar", cutoff: "7:30 PM", capacity: "20,000 / day", phone: "09612-929761" },
  { code: "HUB-KHU-03", name: "Kushtia Cultural Hub", district: "Kushtia", division: "Khulna", address: "Majampur, Kushtia", cutoff: "7:00 PM", capacity: "14,000 / day", phone: "09612-929762" },
  { code: "HUB-KHU-04", name: "Jhenaidah Sorting Node", district: "Jhenaidah", division: "Khulna", address: "Payra Chattar, Jhenaidah", cutoff: "6:30 PM", capacity: "10,000 / day", phone: "09612-929763" },
  { code: "HUB-KHU-05", name: "Satkhira Coastal Hub", district: "Satkhira", division: "Khulna", address: "Kolkata Road, Satkhira", cutoff: "6:30 PM", capacity: "9,500 / day", phone: "09612-929764" },
  { code: "HUB-KHU-06", name: "Bagerhat Port Link Depot", district: "Bagerhat", division: "Khulna", address: "Old Town, Bagerhat", cutoff: "6:00 PM", capacity: "7,000 / day", phone: "09612-929765" },
  { code: "HUB-KHU-07", name: "Chuadanga Border Base", district: "Chuadanga", division: "Khulna", address: "Court Road, Chuadanga", cutoff: "6:00 PM", capacity: "7,500 / day", phone: "09612-929766" },
  { code: "HUB-KHU-08", name: "Meherpur Station", district: "Meherpur", division: "Khulna", address: "Main Road, Meherpur", cutoff: "5:30 PM", capacity: "5,500 / day", phone: "09612-929767" },
  { code: "HUB-KHU-09", name: "Narail District Node", district: "Narail", division: "Khulna", address: "Rupganj, Narail", cutoff: "6:00 PM", capacity: "6,000 / day", phone: "09612-929768" },
  { code: "HUB-KHU-10", name: "Magura Regional Depot", district: "Magura", division: "Khulna", address: "Dhaka Road, Magura", cutoff: "6:30 PM", capacity: "7,000 / day", phone: "09612-929769" },

  // Barishal Division
  { code: "HUB-BAR-01", name: "Barishal River Gateway", district: "Barishal", division: "Barishal", address: "Sadhanar Mor, Barishal Sadar", cutoff: "7:30 PM", capacity: "24,000 / day", phone: "09612-929770", isGateway: true },
  { code: "HUB-BAR-02", name: "Patuakhali Coastal Station", district: "Patuakhali", division: "Barishal", address: "Launch Ghat Road, Patuakhali", cutoff: "6:30 PM", capacity: "10,000 / day", phone: "09612-929771" },
  { code: "HUB-BAR-03", name: "Bhola Island Depot", district: "Bhola", division: "Barishal", address: "Ukheel Para, Bhola", cutoff: "6:00 PM", capacity: "9,000 / day", phone: "09612-929772" },
  { code: "HUB-BAR-04", name: "Pirojpur River Terminal", district: "Pirojpur", division: "Barishal", address: "Town Club Road, Pirojpur", cutoff: "6:00 PM", capacity: "7,500 / day", phone: "09612-929773" },
  { code: "HUB-BAR-05", name: "Barguna South Base", district: "Barguna", division: "Barishal", address: "Sadar Road, Barguna", cutoff: "5:30 PM", capacity: "5,000 / day", phone: "09612-929774" },
  { code: "HUB-BAR-06", name: "Jhalokati Transit Hub", district: "Jhalokati", division: "Barishal", address: "Bishwas Bari, Jhalokati", cutoff: "6:00 PM", capacity: "6,000 / day", phone: "09612-929775" },

  // Rangpur Division
  { code: "HUB-RAN-01", name: "Rangpur Northern Base", district: "Rangpur", division: "Rangpur", address: "Jahangirabad, Rangpur Sadar", cutoff: "7:30 PM", capacity: "26,000 / day", phone: "09612-929780", isGateway: true },
  { code: "HUB-RAN-02", name: "Dinajpur Grain Corridor", district: "Dinajpur", division: "Rangpur", address: "Goneshtola, Dinajpur", cutoff: "7:00 PM", capacity: "15,000 / day", phone: "09612-929781" },
  { code: "HUB-RAN-03", name: "Kurigram Border Terminal", district: "Kurigram", division: "Rangpur", address: "College Mor, Kurigram", cutoff: "6:00 PM", capacity: "8,500 / day", phone: "09612-929782" },
  { code: "HUB-RAN-04", name: "Gaibandha Regional Depot", district: "Gaibandha", division: "Rangpur", address: "Circular Road, Gaibandha", cutoff: "6:30 PM", capacity: "9,000 / day", phone: "09612-929783" },
  { code: "HUB-RAN-05", name: "Nilphamari Industrial Node", district: "Nilphamari", division: "Rangpur", address: "Saidpur Road, Nilphamari", cutoff: "6:30 PM", capacity: "10,000 / day", phone: "09612-929784" },
  { code: "HUB-RAN-06", name: "Lalmonirhat Hub", district: "Lalmonirhat", division: "Rangpur", address: "Mission Mor, Lalmonirhat", cutoff: "6:00 PM", capacity: "6,500 / day", phone: "09612-929785" },
  { code: "HUB-RAN-07", name: "Thakurgaon Transit Depot", district: "Thakurgaon", division: "Rangpur", address: "Old Bus Stand, Thakurgaon", cutoff: "6:00 PM", capacity: "7,000 / day", phone: "09612-929786" },
  { code: "HUB-RAN-08", name: "Panchagarh Northernmost Hub", district: "Panchagarh", division: "Rangpur", address: "Tetulia Road, Panchagarh", cutoff: "5:30 PM", capacity: "6,000 / day", phone: "09612-929787" },

  // Mymensingh Division
  { code: "HUB-MYM-01", name: "Mymensingh Central Hub", district: "Mymensingh", division: "Mymensingh", address: "Ganginarpar, Mymensingh Sadar", cutoff: "7:30 PM", capacity: "25,000 / day", phone: "09612-929790", isGateway: true },
  { code: "HUB-MYM-02", name: "Jamalpur Transit Base", district: "Jamalpur", division: "Mymensingh", address: "Station Road, Jamalpur", cutoff: "7:00 PM", capacity: "12,000 / day", phone: "09612-929791" },
  { code: "HUB-MYM-03", name: "Netrokona Haor Gateway", district: "Netrokona", division: "Mymensingh", address: "Choto Bazar, Netrokona", cutoff: "6:30 PM", capacity: "9,000 / day", phone: "09612-929792" },
  { code: "HUB-MYM-04", name: "Sherpur Hill Border Node", district: "Sherpur", division: "Mymensingh", address: "Nabinagar, Sherpur Sadar", cutoff: "6:00 PM", capacity: "7,500 / day", phone: "09612-929793" },
];

const divisions = [
  "All",
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

export function HubsDirectory() {
  const [selectedDivision, setSelectedDivision] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredHubs = React.useMemo(() => {
    return hubsData.filter((hub) => {
      const matchesDivision =
        selectedDivision === "All" || hub.division === selectedDivision;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        hub.name.toLowerCase().includes(q) ||
        hub.district.toLowerCase().includes(q) ||
        hub.code.toLowerCase().includes(q) ||
        hub.address.toLowerCase().includes(q);
      return matchesDivision && matchesSearch;
    });
  }, [selectedDivision, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Division Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 [scrollbar-width:none]">
          {divisions.map((div) => {
            const isSelected = selectedDivision === div;
            return (
              <button
                key={div}
                type="button"
                onClick={() => setSelectedDivision(div)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {div}
              </button>
            );
          })}
        </div>

        {/* Real-time Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="pointer-events-none absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search district or hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Result Status Banner */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/60 pb-3">
        <span>
          Showing <strong className="text-foreground">{filteredHubs.length}</strong> hubs across{" "}
          {selectedDivision === "All" ? "all 8 divisions" : `${selectedDivision} division`}
        </span>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All Facilities Normal Operations</span>
        </div>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHubs.map((hub) => (
          <div
            key={hub.code}
            className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {hub.code}
                </span>
                <Badge variant={hub.isGateway ? "default" : "outline"} className="text-[10px]">
                  {hub.isGateway ? "Gateway Terminal" : hub.division}
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {hub.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="size-3 text-primary shrink-0" />
                  <span>{hub.district} District, {hub.division}</span>
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {hub.address}
              </p>

              <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    <span>Cutoff Time:</span>
                  </span>
                  <span className="font-semibold text-foreground">{hub.cutoff}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Boxes className="size-3.5 text-primary" />
                    <span>Daily Capacity:</span>
                  </span>
                  <span className="font-semibold text-foreground font-mono">{hub.capacity}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs">
              <a
                href={`tel:${hub.phone}`}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary font-medium"
              >
                <Phone className="size-3" />
                <span>{hub.phone}</span>
              </a>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" />
                <span>Active</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
