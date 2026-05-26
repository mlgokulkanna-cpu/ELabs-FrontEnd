import { useState, useMemo } from "react";
import type { CSSProperties } from "react";

// ─── Color Palette ────────────────────────────────────────────────────────────
const colors = {
  coral: "#E5A488",     // Top apex — warm salmon
  peach: "#DFAD94",     // Left triangle mid
  sand: "#C9BEA8",      // Center-left blend
  seafoam: "#9CCCC0",   // Gradient center
  mint: "#79C8C2",      // Mid-right teal-green
  teal: "#2EB7BF",      // Right triangle bright teal
  ocean: "#00A5BD",     // Right edge deep teal
  deepOcean: "#0B96B3", // Bottom-right darkest
  
  // Light theme background & contrast replacements!
  navy: "#F4F6F9",      // Premium soft-gray light background
  navyMid: "#FFFFFF",   // Card and table container white background
  navyLight: "#E2E8F0", // Slate border color for separators
  white: "#0F172A",     // Primary dark-text color (used to be white)
  offWhite: "#FFFFFF",  // Extra bright surface color
  gray: "#64748B",      // Medium slate text color
  grayLight: "#334155", // Darker slate header text color
  darkText: "#0F172A",  // Main text dark
} as const;

const gradientText: CSSProperties = {
  backgroundImage: `linear-gradient(135deg, ${colors.coral} 0%, ${colors.seafoam} 50%, ${colors.ocean} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrderRow {
  so: string;
  job: string;
  jobStatus: string;
  item: string;
  lineName: string;
  custPO: string;
  custItemNum: string;
  price: number;
  qtyOrdered: number;
  qtyShipped: number;
  dueDate: string;
  custReqDate: string;
  amNotes: string;
  planNotes: string;
  rmStatus: string;
  compStatus: string;
  componentStatus: string;
  elabsMatStatus: string;
  bulkJob: string;
  bulkLot: string;
  projFillDate: string;
  finishGoodLot: string;
  orderDate: string;
  dateShipped: string;
  internalProgress: string;
  progressStatus: string;
  site: string;
  emailAction?: boolean;
}

type SortKey = keyof OrderRow;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockData: OrderRow[] = [
  { so: "S000007034", job: "J000012806", jobStatus: "C", item: "900-645-0-0045", lineName: "Boka 4oz Watermelon Mint Toothpaste", custPO: "POKRK0817", custItemNum: "BOK-FGS-P002-02-AE1US", price: 2.30, qtyOrdered: 0, qtyShipped: 0, dueDate: "07/22/2025", custReqDate: "", amNotes: "On production schedule wk of 6/23. Bulk complete - on track to fill wk of 6/16", planNotes: "AMAZON JOB", rmStatus: "0 Items", compStatus: "0", componentStatus: "4 Items", elabsMatStatus: "Pending Comps", bulkJob: "", bulkLot: "", projFillDate: "03/30/2026", finishGoodLot: "", orderDate: "08/21/2025", dateShipped: "", internalProgress: "Not Released", progressStatus: "Not Released", site: "Colorado" },
  { so: "S000007035", job: "J000012807", jobStatus: "C", item: "900-645-0-0036", lineName: "Boka 1.3oz Ela Mint Toothpaste 2PK", custPO: "POKRK0819", custItemNum: "BOK-FGS-P008-01-AB1US", price: 1.05, qtyOrdered: 0, qtyShipped: 0, dueDate: "07/22/2025", custReqDate: "", amNotes: "Scheduled late wk of 6/23, may roll to wk of 6/30. Amazon labels received 4/30", planNotes: "AMAZON JOB", rmStatus: "0 Items", compStatus: "0", componentStatus: "18 Items", elabsMatStatus: "Materials Clear", bulkJob: "", bulkLot: "P2511-000000033", projFillDate: "", finishGoodLot: "P2511-000000033", orderDate: "09/02/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007052", job: "J000013263", jobStatus: "C", item: "900-645-0-0024", lineName: "Boka 4oz Ela Mint 3 Pack", custPO: "POKRK0818", custItemNum: "BOK-FGS-P007-01-AB1US", price: 1.89, qtyOrdered: 33, qtyShipped: 0, dueDate: "07/24/2025", custReqDate: "", amNotes: "", planNotes: "", rmStatus: "0 Items", compStatus: "0", componentStatus: "18 Items", elabsMatStatus: "Materials Clear", bulkJob: "", bulkLot: "P2511-000000033", projFillDate: "", finishGoodLot: "P2511-000000033", orderDate: "09/02/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007080", job: "J000012867", jobStatus: "C", item: "900-645-0-0013", lineName: "Boka 4oz Ela Mint Toothpaste", custPO: "POKRK0868", custItemNum: "BOK-FGS-P002-01-AB1US", price: 2.13, qtyOrdered: 0, qtyShipped: 0, dueDate: "08/04/2025", custReqDate: "", amNotes: "Bulk released for compounding, trying to produce ASAP", planNotes: "Bulk released for compounding, trying to produce ASAP", rmStatus: "0 Items", compStatus: "0", componentStatus: "18 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010181", bulkLot: "P2511-000000009", projFillDate: "02/23/2026", finishGoodLot: "P2511-000000033", orderDate: "09/02/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007101", job: "J000012901", jobStatus: "C", item: "900-645-0-0022", lineName: "Boka 4oz Cinnamon Mint Toothpaste", custPO: "POKRK0870", custItemNum: "BOK-FGS-P003-01-AB1US", price: 2.13, qtyOrdered: 12, qtyShipped: 0, dueDate: "08/10/2025", custReqDate: "", amNotes: "Production scheduled wk of 7/7", planNotes: "", rmStatus: "2 Items", compStatus: "1", componentStatus: "12 Items", elabsMatStatus: "Materials Clear", bulkJob: "", bulkLot: "", projFillDate: "07/14/2025", finishGoodLot: "", orderDate: "07/07/2025", dateShipped: "", internalProgress: "In Production", progressStatus: "In Production", site: "Colorado" },
  { so: "S000007115", job: "J000012950", jobStatus: "C", item: "900-645-0-0031", lineName: "Boka Kids Watermelon Toothpaste", custPO: "POKRK0872", custItemNum: "BOK-FGS-P010-01-AB1US", price: 1.75, qtyOrdered: 20, qtyShipped: 0, dueDate: "08/15/2025", custReqDate: "", amNotes: "Awaiting component delivery ETA 7/12", planNotes: "Hold for components", rmStatus: "3 Items", compStatus: "2", componentStatus: "8 Items", elabsMatStatus: "Pending Comps", bulkJob: "", bulkLot: "", projFillDate: "07/21/2025", finishGoodLot: "", orderDate: "07/14/2025", dateShipped: "", internalProgress: "Not Released", progressStatus: "Not Released", site: "Colorado" },
  { so: "S000007128", job: "J000013010", jobStatus: "C", item: "900-645-0-0047", lineName: "Boka Coconut Mint Toothpaste 4oz", custPO: "POKRK0875", custItemNum: "BOK-FGS-P005-02-AB1US", price: 2.25, qtyOrdered: 0, qtyShipped: 0, dueDate: "08/20/2025", custReqDate: "", amNotes: "Target fill wk of 7/28", planNotes: "AMAZON JOB", rmStatus: "0 Items", compStatus: "0", componentStatus: "18 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010245", bulkLot: "P2511-000000041", projFillDate: "07/28/2025", finishGoodLot: "", orderDate: "07/21/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007140", job: "J000013055", jobStatus: "C", item: "900-645-0-0019", lineName: "Boka Charcoal Toothpaste 4oz", custPO: "POKRK0880", custItemNum: "BOK-FGS-P006-01-AB1US", price: 2.45, qtyOrdered: 8, qtyShipped: 0, dueDate: "08/28/2025", custReqDate: "", amNotes: "Bulk in process, on track", planNotes: "", rmStatus: "1 Items", compStatus: "0", componentStatus: "15 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010267", bulkLot: "", projFillDate: "08/04/2025", finishGoodLot: "", orderDate: "07/28/2025", dateShipped: "", internalProgress: "In Production", progressStatus: "In Production", site: "Colorado" },
  { so: "S000007152", job: "J000013102", jobStatus: "C", item: "900-645-0-0051", lineName: "Boka Whitening Toothpaste 4oz", custPO: "POKRK0882", custItemNum: "BOK-FGS-P011-01-AB1US", price: 2.65, qtyOrdered: 15, qtyShipped: 0, dueDate: "09/01/2025", custReqDate: "08/25/2025", amNotes: "Customer requested early delivery", planNotes: "Priority order", rmStatus: "0 Items", compStatus: "0", componentStatus: "20 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010289", bulkLot: "P2511-000000055", projFillDate: "08/11/2025", finishGoodLot: "P2511-000000055", orderDate: "08/04/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007163", job: "J000013145", jobStatus: "C", item: "900-645-0-0038", lineName: "Boka Kids Berry Toothpaste", custPO: "POKRK0885", custItemNum: "BOK-FGS-P012-01-AB1US", price: 1.85, qtyOrdered: 25, qtyShipped: 0, dueDate: "09/05/2025", custReqDate: "", amNotes: "Scheduled for filling wk of 8/18", planNotes: "", rmStatus: "0 Items", compStatus: "0", componentStatus: "10 Items", elabsMatStatus: "Materials Clear", bulkJob: "", bulkLot: "P2511-000000058", projFillDate: "08/18/2025", finishGoodLot: "", orderDate: "08/11/2025", dateShipped: "", internalProgress: "In Filling", progressStatus: "In Filling", site: "Colorado" },
  { so: "S000007175", job: "J000013188", jobStatus: "C", item: "900-645-0-0029", lineName: "Boka Sensitive Mint Toothpaste", custPO: "POKRK0888", custItemNum: "BOK-FGS-P013-01-AB1US", price: 2.35, qtyOrdered: 0, qtyShipped: 0, dueDate: "09/10/2025", custReqDate: "", amNotes: "Bulk released, on track for 8/25 fill", planNotes: "AMAZON JOB", rmStatus: "0 Items", compStatus: "0", componentStatus: "18 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010312", bulkLot: "P2511-000000061", projFillDate: "08/25/2025", finishGoodLot: "", orderDate: "08/18/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007188", job: "J000013231", jobStatus: "C", item: "900-645-0-0043", lineName: "Boka Spearmint Toothpaste 4oz", custPO: "POKRK0891", custItemNum: "BOK-FGS-P014-01-AB1US", price: 2.10, qtyOrdered: 10, qtyShipped: 0, dueDate: "09/15/2025", custReqDate: "09/10/2025", amNotes: "Customer date 9/10, target fill wk 9/1", planNotes: "Rush order", rmStatus: "1 Items", compStatus: "1", componentStatus: "16 Items", elabsMatStatus: "Pending Comps", bulkJob: "", bulkLot: "", projFillDate: "09/01/2025", finishGoodLot: "", orderDate: "08/25/2025", dateShipped: "", internalProgress: "Not Released", progressStatus: "Not Released", site: "Colorado" },
  { so: "S000007201", job: "J000013275", jobStatus: "C", item: "900-645-0-0015", lineName: "Boka Natural Fluoride Toothpaste", custPO: "POKRK0894", custItemNum: "BOK-FGS-P015-01-AB1US", price: 2.20, qtyOrdered: 30, qtyShipped: 0, dueDate: "09/20/2025", custReqDate: "", amNotes: "On schedule, bulk wk 9/8", planNotes: "", rmStatus: "0 Items", compStatus: "0", componentStatus: "14 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010334", bulkLot: "", projFillDate: "09/08/2025", finishGoodLot: "", orderDate: "09/01/2025", dateShipped: "", internalProgress: "In Production", progressStatus: "In Production", site: "Colorado" },
  { so: "S000007214", job: "J000013318", jobStatus: "C", item: "900-645-0-0027", lineName: "Boka Travel Size Mint Set", custPO: "POKRK0897", custItemNum: "BOK-FGS-P016-01-AB1US", price: 3.50, qtyOrdered: 5, qtyShipped: 0, dueDate: "09/25/2025", custReqDate: "", amNotes: "Awaiting box components", planNotes: "Hold - components ETA 9/12", rmStatus: "2 Items", compStatus: "3", componentStatus: "6 Items", elabsMatStatus: "Pending Comps", bulkJob: "", bulkLot: "", projFillDate: "09/15/2025", finishGoodLot: "", orderDate: "09/08/2025", dateShipped: "", internalProgress: "Not Released", progressStatus: "Not Released", site: "Colorado" },
  { so: "S000007226", job: "J000013360", jobStatus: "C", item: "900-645-0-0033", lineName: "Boka Gum Health Toothpaste", custPO: "POKRK0900", custItemNum: "BOK-FGS-P017-01-AB1US", price: 2.55, qtyOrdered: 18, qtyShipped: 0, dueDate: "10/01/2025", custReqDate: "", amNotes: "Bulk scheduled wk 9/22", planNotes: "", rmStatus: "0 Items", compStatus: "0", componentStatus: "16 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010356", bulkLot: "P2511-000000072", projFillDate: "09/22/2025", finishGoodLot: "", orderDate: "09/15/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007238", job: "J000013403", jobStatus: "C", item: "900-645-0-0049", lineName: "Boka Antioxidant Toothpaste", custPO: "POKRK0903", custItemNum: "BOK-FGS-P018-01-AB1US", price: 2.75, qtyOrdered: 22, qtyShipped: 0, dueDate: "10/08/2025", custReqDate: "10/01/2025", amNotes: "Customer requires 10/1 per contract", planNotes: "Rush production", rmStatus: "0 Items", compStatus: "0", componentStatus: "18 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010378", bulkLot: "P2511-000000075", projFillDate: "09/29/2025", finishGoodLot: "P2511-000000075", orderDate: "09/22/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007250", job: "J000013446", jobStatus: "C", item: "900-645-0-0041", lineName: "Boka Activated Charcoal Whitening", custPO: "POKRK0906", custItemNum: "BOK-FGS-P019-01-AB1US", price: 2.90, qtyOrdered: 0, qtyShipped: 0, dueDate: "10/15/2025", custReqDate: "", amNotes: "AMAZON JOB - fill wk 10/6", planNotes: "AMAZON JOB", rmStatus: "0 Items", compStatus: "0", componentStatus: "20 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010400", bulkLot: "P2511-000000078", projFillDate: "10/06/2025", finishGoodLot: "", orderDate: "09/29/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007262", job: "J000013489", jobStatus: "C", item: "900-645-0-0035", lineName: "Boka Pro Whitening Strips", custPO: "POKRK0909", custItemNum: "BOK-FGS-P020-01-AB1US", price: 4.25, qtyOrdered: 7, qtyShipped: 0, dueDate: "10/22/2025", custReqDate: "", amNotes: "Formulation finalized, production 10/13", planNotes: "New SKU - first production run", rmStatus: "5 Items", compStatus: "4", componentStatus: "5 Items", elabsMatStatus: "Pending Comps", bulkJob: "", bulkLot: "", projFillDate: "10/13/2025", finishGoodLot: "", orderDate: "10/06/2025", dateShipped: "", internalProgress: "Not Released", progressStatus: "Not Released", site: "Colorado" },
  { so: "S000007275", job: "J000013532", jobStatus: "C", item: "900-645-0-0053", lineName: "Boka Remineralizing Toothpaste", custPO: "POKRK0912", custItemNum: "BOK-FGS-P021-01-AB1US", price: 2.60, qtyOrdered: 40, qtyShipped: 0, dueDate: "10/28/2025", custReqDate: "", amNotes: "Large order, two fill sessions planned", planNotes: "Split into 2 lots", rmStatus: "0 Items", compStatus: "0", componentStatus: "22 Items", elabsMatStatus: "Materials Clear", bulkJob: "BK00010422", bulkLot: "P2511-000000081", projFillDate: "10/20/2025", finishGoodLot: "P2511-000000081", orderDate: "10/13/2025", dateShipped: "", internalProgress: "Bulk Complete Approved for Filling", progressStatus: "Bulk Complete", site: "Colorado" },
  { so: "S000007288", job: "J000013575", jobStatus: "C", item: "900-645-0-0057", lineName: "Boka Enzyme Toothpaste 4oz", custPO: "POKRK0915", custItemNum: "BOK-FGS-P022-01-AB1US", price: 2.80, qtyOrdered: 14, qtyShipped: 0, dueDate: "11/03/2025", custReqDate: "10/27/2025", amNotes: "Customer needs before holiday season", planNotes: "Priority holiday rush", rmStatus: "1 Items", compStatus: "1", componentStatus: "17 Items", elabsMatStatus: "Pending Comps", bulkJob: "", bulkLot: "", projFillDate: "10/27/2025", finishGoodLot: "", orderDate: "10/20/2025", dateShipped: "", internalProgress: "Not Released", progressStatus: "Not Released", site: "Colorado" },
];

// ─── Status Styling ───────────────────────────────────────────────────────────
interface StatusColorDef {
  bg: string;
  text: string;
  border: string;
}

const statusColors: Record<string, StatusColorDef> = {
  "Not Released":                      { bg: "#e8ffee", text: "#2b912b", border: "#cbefd5" },
  "Bulk Complete":                     { bg: "#E6F4F2", text: "#1E7B74", border: "#79C8C2" },
  "Bulk Complete Approved for Filling":{ bg: "#E0F7FA", text: "#007A8C", border: "#00A5BD" },
  "In Production":                     { bg: "#FDF2EC", text: "#A76548", border: "#E5A488" },
  "In Filling":                        { bg: "#F7F5F0", text: "#7A6E53", border: "#C9BEA8" },
  "Materials Clear":                   { bg: "#E6F4F2", text: "#1E7B74", border: "#79C8C2" },
  "Pending Comps":                     { bg: "#FEE2E2", text: "#B91C1C", border: "#FCA5A5" },
};

const getStatusStyle = (status: string): CSSProperties => {
  const s: StatusColorDef = statusColors[status] ?? { bg: "#F1F5F9", text: colors.gray, border: colors.navyLight };
  return {
    backgroundColor: s.bg,
    color: s.text,
    border: `1px solid ${s.border}`,
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    display: "inline-block",
  };
};

// ─── Column definitions ───────────────────────────────────────────────────────
const table1Cols: { key: SortKey; label: string }[] = [
  { key: "so",               label: "Sales Order #" },
  { key: "job",              label: "Job" },
  { key: "jobStatus",        label: "Job Status" },
  { key: "item",             label: "Item" },
  { key: "lineName",         label: "Line Name" },
  { key: "custPO",           label: "Customer PO" },
  { key: "custItemNum",      label: "Cust Item #" },
  { key: "price",            label: "Price" },
  { key: "qtyOrdered",       label: "Qty Ordered" },
  { key: "qtyShipped",       label: "Qty Shipped" },
  { key: "dueDate",          label: "Due Date" },
  { key: "custReqDate",      label: "Cust Req Date" },
  { key: "amNotes",          label: "AM Notes" },
  { key: "planNotes",        label: "Notes for Planning" },
  { key: "rmStatus",         label: "Raw Mat Status" },
  { key: "compStatus",       label: "Comp Status" },
  { key: "componentStatus",  label: "Component Status" },
  { key: "elabsMatStatus",   label: "ELABS Supplied Mat Status" },
  { key: "bulkJob",          label: "Bulk Job" },
  { key: "bulkLot",          label: "Bulk Lot" },
  { key: "projFillDate",     label: "Projected Fill Date" },
  { key: "finishGoodLot",    label: "Finish Good Lot" },
  { key: "orderDate",        label: "Order Date" },
  { key: "dateShipped",      label: "Date Shipped" },
  { key: "internalProgress", label: "Internal Progress Status" },
  { key: "progressStatus",   label: "Progress Status" },
  { key: "site",             label: "Site" },
  { key: "emailAction",      label: "Email" },
];

const table2Cols: { key: SortKey; label: string }[] = [
  { key: "so",               label: "Sales Order #" },
  { key: "componentStatus",  label: "Component Status" },
  { key: "elabsMatStatus",   label: "ELABS Mat Status" },
  { key: "bulkJob",          label: "Bulk Job" },
  { key: "bulkLot",          label: "Bulk Lot" },
  { key: "projFillDate",     label: "Proj Fill Date" },
  { key: "finishGoodLot",    label: "Finish Good Lot" },
  { key: "orderDate",        label: "Order Date" },
  { key: "dateShipped",      label: "Date Shipped" },
  { key: "internalProgress", label: "Internal Progress Status" },
  { key: "progressStatus",   label: "Progress Status" },
  { key: "site",             label: "Site" },
  { key: "emailAction",      label: "Email" },
];

const statuses = [
  "All",
  "Not Released",
  "In Production",
  "Bulk Complete",
  "Bulk Complete Approved for Filling",
  "In Filling",
  "Pending Comps",
  "Materials Clear",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ElevationLabsOOR() {
  const [data, setData]               = useState<OrderRow[]>(mockData);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortCol, setSortCol]         = useState<SortKey>("so");
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab]     = useState<"table1" | "table2">("table1");
  const [selectedRow, setSelectedRow] = useState<OrderRow | null>(null);
  const [showEmailPopup, setShowEmailPopup] = useState<OrderRow | null>(null);

  // ── Filtered + sorted data ──
  const filtered = useMemo<OrderRow[]>(() => {
    let d: OrderRow[] = data;

    if (search) {
      const q = search.toLowerCase();
      d = d.filter(
        (r) =>
          r.so.toLowerCase().includes(q) ||
          r.lineName.toLowerCase().includes(q) ||
          r.job.toLowerCase().includes(q) ||
          r.custPO.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "All") {
      d = d.filter(
        (r) =>
          r.progressStatus === filterStatus ||
          r.internalProgress === filterStatus ||
          r.elabsMatStatus === filterStatus
      );
    }

    return [...d].sort((a, b) => {
      const av = a[sortCol] ?? "";
      const bv = b[sortCol] ?? "";
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [search, filterStatus, sortCol, sortDir]);

  const handleSort = (col: SortKey) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  // ── Summary stats (derived from full dataset) ──
  const stats = useMemo(() => ({
    total:       data.length,
    notReleased: data.filter((r) => r.progressStatus === "Not Released").length,
    bulkComplete:data.filter((r) => r.progressStatus.includes("Bulk Complete")).length,
    inProd:      data.filter((r) => r.progressStatus === "In Production" || r.progressStatus === "In Filling").length,
    pending:     data.filter((r) => r.elabsMatStatus === "Pending Comps").length,
  }), [data]);

  // ── Style helpers ──
  const thStyle = (col: SortKey): CSSProperties => ({
    padding: "10px 12px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 700,
    color: sortCol === col ? colors.white : colors.grayLight,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    borderBottom: `2px solid ${sortCol === col ? colors.teal : colors.navyLight}`,
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    position: "sticky",
    top: 0,
    background: sortCol === col ? "rgba(46, 183, 191, 0.08)" : colors.navyMid,
    zIndex: 2,
  });

  const tdStyle: CSSProperties = {
    padding: "9px 12px",
    fontSize: "12px",
    color: "#334155",
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
    verticalAlign: "middle",
    maxWidth: "180px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const SortArrow = ({ col }: { col: SortKey }) => (
    <span style={{ marginLeft: 4, opacity: sortCol === col ? 1 : 0.3, fontSize: 10 }}>
      {sortCol === col ? (sortDir === "asc" ? "▲" : "▼") : "▲"}
    </span>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: colors.navy, minHeight: "100vh", color: colors.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${colors.navy}; }
        ::-webkit-scrollbar-thumb { background: ${colors.navyLight}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${colors.teal}; }
        .row-hover:hover td { background: rgba(0, 0, 0, 0.015) !important; }
        .stat-card { transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { background: rgba(0, 0, 0, 0.04) !important; }
        .filter-chip { transition: all 0.15s; cursor: pointer; }
        .filter-chip:hover { opacity: 0.85; }
        input::placeholder { color: #94A3B8; }
        input:focus { outline: none; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(90deg, ${colors.navyMid} 0%, ${colors.navy} 100%)`,
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 36, height: 36 }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <defs>
                <linearGradient id="gLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.coral} />
                  <stop offset="50%" stopColor={colors.peach} />
                  <stop offset="100%" stopColor={colors.sand} />
                </linearGradient>
                <linearGradient id="gCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.sand} />
                  <stop offset="50%" stopColor={colors.seafoam} />
                  <stop offset="100%" stopColor={colors.mint} />
                </linearGradient>
                <linearGradient id="gRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.mint} />
                  <stop offset="50%" stopColor={colors.teal} />
                  <stop offset="100%" stopColor={colors.ocean} />
                </linearGradient>
                <linearGradient id="gDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.ocean} />
                  <stop offset="100%" stopColor={colors.deepOcean} />
                </linearGradient>
              </defs>
              <polygon points="18,2 6,24 18,24" fill="url(#gLeft)" />
              <polygon points="18,2 18,24 30,24" fill="url(#gCenter)" opacity="0.95" />
              <polygon points="30,24 18,2 32,12" fill="url(#gRight)" />
              <polygon points="6,24 30,24 18,32" fill="url(#gDark)" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 20, color: colors.gray, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: -2 }}>
              Open Order Report
            </div>
          </div>
        </div>

        {/* Header actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: colors.grayLight }}>
            Customer: <span style={{ color: colors.teal, fontWeight: 600 }}>Boka LLC</span>&nbsp;&nbsp;#645
          </div>
          <div style={{ background: "rgba(46,183,191,0.08)", border: `1px solid ${colors.teal}33`, borderRadius: 8, padding: "6px 14px", fontSize: 12, color: colors.ocean, fontWeight: 600 }}>
            Report #11305
          </div>
          <button style={{ background: `linear-gradient(135deg, ${colors.coral}, ${colors.ocean})`, border: "none", borderRadius: 8, padding: "7px 18px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: "0.05em" }}>
            Export
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 32px" }}>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { 
              label: "Total Orders", val: stats.total, 
              bg: "linear-gradient(to right, #FFCCB3, #FFD9C2)", text: "#8B4533",
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V10a2 2 0 0 1 2-2h4M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18M14 22V10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12M10 22v-4a2 2 0 0 0-2-2H8M14 22v-4a2 2 0 0 1 2-2h2"/></svg>
            },
            { 
              label: "Not Released", val: stats.notReleased, 
              bg: "linear-gradient(to right, #D5F5D5, #E3FAE3)", text: "#406A3A",
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            },
            { 
              label: "Bulk Complete", val: stats.bulkComplete, 
              bg: "linear-gradient(to right, #C2F0E5, #D9F5ED)", text: "#28665B",
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            },
            { 
              label: "In Production", val: stats.inProd, 
             bg: "linear-gradient(to right, #C9EEF5, #E2F6FA)", text: "#00A5BD",
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            },
            { 
              label: "Pending Components", val: stats.pending, 
              bg: "linear-gradient(to right, #C2EBFA, #D9F3FB)", text: "#166c86",
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ background: s.bg, color: s.text, borderRadius: "4px", padding: "16px 20px", border: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>{s.label}</div>
                <div style={{ opacity: 0.8 }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, marginTop: "8px", lineHeight: 1 }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {([{ id: "table1", label: "Sales Order View" }, { id: "table2", label: "Production Status" }] as const).map((tab) => (
            <button
              key={tab.id}
              className="tab-btn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg, rgba(229,164,136,0.15), rgba(46,183,191,0.15))" : "transparent",
                border: activeTab === tab.id ? `1px solid ${colors.teal}66` : "1px solid rgba(0,0,0,0.06)",
                borderRadius: "8px 8px 0 0",
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: activeTab === tab.id ? colors.ocean : colors.gray,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Controls Bar ── */}
        <div style={{ background: colors.navyMid, border: "1px solid rgba(0,0,0,0.05)", borderRadius: "0 12px 0 0", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SO, Job, PO, Product..."
            style={{ background: colors.navy, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: colors.white, width: 260 }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {statuses.map((s) => (
              <span
                key={s}
                className="filter-chip"
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  border: filterStatus === s ? `1px solid ${colors.teal}` : "1px solid rgba(0,0,0,0.06)",
                  background: filterStatus === s ? "rgba(46,183,191,0.15)" : "rgba(0,0,0,0.02)",
                  color: filterStatus === s ? colors.teal : colors.gray,
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <div style={{ marginLeft: "auto", fontSize: 12, color: colors.gray }}>
            Showing <span style={{ color: colors.white, fontWeight: 600 }}>{filtered.length}</span> of {data.length} records
          </div>
        </div>

        {/* ── Table Container ── */}
        <div style={{ background: colors.navyMid, border: "1px solid rgba(0,0,0,0.05)", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "auto", maxHeight: "60vh" }}>

          {/* ─ Table 1: Sales Order View ─ */}
          {activeTab === "table1" && (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 2800 }}>
              <thead>
                <tr>
                  {table1Cols.map((col) => (
                    <th key={col.key} style={thStyle(col.key)} onClick={() => handleSort(col.key)}>
                      {col.label} <SortArrow col={col.key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.so} className="row-hover" style={{ background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.01)" }}>
                    <td style={{ ...tdStyle, color: colors.teal, fontWeight: 600, fontSize: 13 }}>{row.so}</td>
                    <td style={{ ...tdStyle, color: colors.coral }}>{row.job}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <span style={{ background: "rgba(46,183,191,0.08)", border: `1px solid ${colors.teal}33`, borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700, color: colors.ocean }}>
                        {row.jobStatus}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: 11, color: colors.gray }}>{row.item}</td>
                    <td style={{ ...tdStyle, maxWidth: 160, color: colors.white, fontWeight: 500 }}>{row.lineName}</td>
                    <td style={tdStyle}>{row.custPO}</td>
                    <td style={{ ...tdStyle, fontSize: 11 }}>{row.custItemNum}</td>
                    <td style={{ ...tdStyle, color: "#0D9488", fontWeight: 600 }}>${row.price.toFixed(2)}</td>
                    <td style={{ ...tdStyle, textAlign: "center", color: row.qtyOrdered > 0 ? colors.white : colors.gray }}>{row.qtyOrdered}</td>
                    <td style={{ ...tdStyle, textAlign: "center", color: row.qtyShipped > 0 ? "#16A34A" : colors.gray }}>{row.qtyShipped}</td>
                    <td style={{ ...tdStyle, color: colors.grayLight }}>{row.dueDate}</td>
                    <td style={{ ...tdStyle, color: row.custReqDate ? colors.coral : colors.gray }}>{row.custReqDate || "—"}</td>
                    <td style={{ ...tdStyle, maxWidth: 200, color: "#475569", fontSize: 11, whiteSpace: "normal", lineHeight: 1.4, padding: "4px" }}>
                      <textarea
                        value={row.amNotes}
                        onChange={(e) => {
                          const newData = [...data];
                          const idx = newData.findIndex(r => r.so === row.so);
                          if (idx !== -1) {
                            newData[idx] = { ...newData[idx], amNotes: e.target.value };
                            setData(newData);
                          }
                        }}
                        style={{ width: "100%", height: "48px", resize: "vertical", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 4, padding: "4px", fontSize: "11px", fontFamily: "inherit", background: "transparent", color: "inherit" }}
                      />
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 180, fontSize: 11, color: "#475569", whiteSpace: "normal", lineHeight: 1.4, padding: "4px" }}>
                      <textarea
                        value={row.planNotes}
                        onChange={(e) => {
                          const newData = [...data];
                          const idx = newData.findIndex(r => r.so === row.so);
                          if (idx !== -1) {
                            newData[idx] = { ...newData[idx], planNotes: e.target.value };
                            setData(newData);
                          }
                        }}
                        style={{ width: "100%", height: "48px", resize: "vertical", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 4, padding: "4px", fontSize: "11px", fontFamily: "inherit", background: "transparent", color: "inherit" }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <span onClick={() => setSelectedRow(row)} style={{ ...getStatusStyle(row.rmStatus.includes("0") ? "Materials Clear" : "Pending Comps"), cursor: "pointer" }}>{row.rmStatus}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <span onClick={() => setSelectedRow(row)} style={{ ...getStatusStyle(parseInt(row.compStatus) === 0 ? "Materials Clear" : "Pending Comps"), cursor: "pointer" }}>
                        {row.compStatus.includes("Item") ? row.compStatus : `${row.compStatus} Items`}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ ...getStatusStyle(row.elabsMatStatus), padding: "3px 10px" }}>{row.componentStatus}</span>
                    </td>
                    <td style={tdStyle}><span style={getStatusStyle(row.elabsMatStatus)}>{row.elabsMatStatus}</span></td>
                    <td style={{ ...tdStyle, color: row.bulkJob ? colors.coral : colors.gray }}>{row.bulkJob || "—"}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: row.bulkLot ? colors.grayLight : colors.gray }}>{row.bulkLot || "—"}</td>
                    <td style={{ ...tdStyle, color: row.projFillDate ? "#0D9488" : colors.gray, fontWeight: row.projFillDate ? 600 : 400 }}>{row.projFillDate || "—"}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: row.finishGoodLot ? colors.grayLight : colors.gray }}>{row.finishGoodLot || "—"}</td>
                    <td style={tdStyle}>{row.orderDate}</td>
                    <td style={{ ...tdStyle, color: row.dateShipped ? "#16A34A" : colors.gray }}>{row.dateShipped || "—"}</td>
                    <td style={tdStyle}><span style={getStatusStyle(row.internalProgress)}>{row.internalProgress}</span></td>
                    <td style={tdStyle}><span style={getStatusStyle(row.progressStatus)}>{row.progressStatus}</span></td>
                    <td style={{ ...tdStyle, color: colors.ocean }}>{row.site}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowEmailPopup(row); }}
                        style={{ background: "#4bc2c9", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
                      >
                        Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ─ Table 2: Production Status ─ */}
          {activeTab === "table2" && (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
              <thead>
                <tr>
                  {table2Cols.map((col) => (
                    <th key={col.key} style={thStyle(col.key)} onClick={() => handleSort(col.key)}>
                      {col.label} <SortArrow col={col.key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.so} className="row-hover" style={{ background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.01)" }}>
                    <td style={{ ...tdStyle, color: colors.teal, fontWeight: 600, fontSize: 13 }}>{row.so}</td>
                    <td style={tdStyle}>
                      <span style={{ ...getStatusStyle(row.elabsMatStatus), padding: "3px 10px" }}>{row.componentStatus}</span>
                    </td>
                    <td style={tdStyle}><span style={getStatusStyle(row.elabsMatStatus)}>{row.elabsMatStatus}</span></td>
                    <td style={{ ...tdStyle, color: row.bulkJob ? colors.coral : colors.gray }}>{row.bulkJob || "—"}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: row.bulkLot ? colors.grayLight : colors.gray }}>{row.bulkLot || "—"}</td>
                    <td style={{ ...tdStyle, color: row.projFillDate ? "#0D9488" : colors.gray, fontWeight: row.projFillDate ? 600 : 400 }}>{row.projFillDate || "—"}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: row.finishGoodLot ? colors.grayLight : colors.gray }}>{row.finishGoodLot || "—"}</td>
                    <td style={tdStyle}>{row.orderDate}</td>
                    <td style={{ ...tdStyle, color: row.dateShipped ? "#16A34A" : colors.gray }}>{row.dateShipped || "—"}</td>
                    <td style={tdStyle}><span style={getStatusStyle(row.internalProgress)}>{row.internalProgress}</span></td>
                    <td style={tdStyle}><span style={getStatusStyle(row.progressStatus)}>{row.progressStatus}</span></td>
                    <td style={{ ...tdStyle, color: colors.ocean }}>{row.site}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
          <div style={{ fontSize: 11, color: colors.gray }}>
            © 2025 – OnSight &nbsp;·&nbsp; Elevation Labs OOR Dashboard
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 14px", fontSize: 12, color: colors.grayLight, cursor: "pointer" }}>
              Email
            </button>
            <button style={{ background: `linear-gradient(135deg, ${colors.coral}33, ${colors.ocean}33)`, border: `1px solid ${colors.teal}`, borderRadius: 6, padding: "6px 14px", fontSize: 12, color: colors.ocean, fontWeight: 600, cursor: "pointer" }}>
              Save Report
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedRow && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 999,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            background: "#fff", color: "#333", width: "900px", maxWidth: "95vw",
            maxHeight: "95vh", overflow: "auto", borderRadius: "4px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            {/* Header */}
            <div style={{ background: "#ADD8E6", padding: "12px 16px", fontSize: "16px", fontWeight: "bold", borderBottom: "1px solid #99c2cf" }}>
              SO: {selectedRow.so} Line: 2 Job: {selectedRow.job}
            </div>
            
            <div style={{ padding: "16px", display: "flex", gap: "24px" }}>
              {/* Left Column */}
              <div style={{ flex: 1, fontSize: "12px", lineHeight: "1.6" }}>
                <div style={{ fontWeight: "bold" }}>Job Status: <span style={{ fontWeight: "normal" }}>{selectedRow.jobStatus}</span></div>
                
                <div style={{ fontWeight: "bold", marginTop: 4 }}>Internal Prog. Status:</div>
                <select defaultValue={selectedRow.internalProgress} style={{ width: "100%", marginBottom: 4, padding: "2px" }}>
                  {statuses.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                  Progress Status: 
                  <select defaultValue={selectedRow.progressStatus} style={{ flex: 1, padding: "2px" }}>
                    {statuses.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div style={{ fontWeight: "bold", marginTop: 4 }}>Order Date: <span style={{ fontWeight: "normal" }}>{selectedRow.orderDate}</span></div>
                <div style={{ fontWeight: "bold" }}>Cust. Request Date: <span style={{ fontWeight: "normal" }}>{selectedRow.custReqDate || "—"}</span></div>
                <div style={{ fontWeight: "bold" }}>Original Due Date: <span style={{ fontWeight: "normal" }}>{selectedRow.dueDate}</span></div>
                <div style={{ fontWeight: "bold" }}>Due Date: <span style={{ fontWeight: "normal" }}></span></div>
                <div style={{ fontWeight: "bold" }}>BK Job: <span style={{ fontWeight: "normal" }}>{selectedRow.bulkJob}</span></div>
                <div style={{ fontWeight: "bold" }}>BK Lot: <span style={{ fontWeight: "normal" }}>{selectedRow.bulkLot}</span></div>
                <div style={{ fontWeight: "bold" }}>FG Lot: <span style={{ fontWeight: "normal" }}>{selectedRow.finishGoodLot}</span></div>
                <div style={{ fontWeight: "bold" }}>Item: <span style={{ fontWeight: "normal" }}>{selectedRow.item}</span></div>
                <div style={{ fontWeight: "bold" }}>Line Name: <span style={{ fontWeight: "normal" }}>{selectedRow.lineName}</span></div>
                <div style={{ color: "#666" }}>RETAIL</div>
                <div style={{ fontWeight: "bold" }}>Cust PO: <span style={{ fontWeight: "normal" }}>{selectedRow.custPO}</span></div>
                <div style={{ fontWeight: "bold" }}>Cust Item Num: <span style={{ fontWeight: "normal" }}>{selectedRow.custItemNum}</span></div>
                <div style={{ fontWeight: "bold" }}>SO Line Status: <span style={{ fontWeight: "normal" }}>Planned</span></div>
                <div style={{ fontWeight: "bold" }}>Price: <span style={{ fontWeight: "normal" }}>{selectedRow.price}</span></div>
                <div style={{ fontWeight: "bold" }}>Qty Ordered: <span style={{ fontWeight: "normal" }}>{selectedRow.qtyOrdered}</span></div>
                <div style={{ fontWeight: "bold" }}>Cust Supplied Material Status: <span style={{ fontWeight: "normal" }}>{selectedRow.elabsMatStatus}</span></div>
              </div>

              {/* Middle Column (AM Notes) */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: 4 }}>AM Notes</div>
                <textarea defaultValue={selectedRow.amNotes} style={{ flex: 1, minHeight: "280px", resize: "none", padding: "8px", border: "1px solid #ccc" }} />
              </div>

              {/* Right Column (Notes for Planning) */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: 4 }}>Notes for Planning</div>
                <textarea defaultValue={selectedRow.planNotes} style={{ flex: 1, minHeight: "280px", resize: "none", padding: "8px", border: "1px solid #ccc" }} />
              </div>
            </div>

            <div style={{ padding: "0 16px" }}>
              <a href="#" style={{ display: "block", color: "#0066cc", fontSize: "12px", marginBottom: "4px", textDecoration: "underline" }}>See all AM Notes</a>
              <a href="#" style={{ display: "block", color: "#0066cc", fontSize: "12px", marginBottom: "16px", textDecoration: "underline" }}>See all Notes for Planning</a>
            </div>

            {/* Bottom Lists */}
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "4px" }}>Component Status</div>
              <textarea 
                defaultValue={"________CUSTOMER SUPPLIED SHORT________\n________CUSTOMER SUPPLIED GOOD________\n________SUPPLIED BY ELEVATION LABS________\nTUBE - 504042C [221-000-2-0750] | OH (0.00) REQ (48,264.00) | SHORT | Need PO\nTUBE - 504042B [*221-000-1-0750] | OH (0.00) REQ (48,264.00) | SHORT | Need PO\nCTNU - V2 [203-000-1-3817] | OH (145,998.00) REQ (48,264.00) | GOOD\nCTNM - [205-000-0-0732] | OH (102,063.00) REQ (4,023.00) | GOOD"} 
                style={{ width: "100%", height: "120px", resize: "none", border: "2px solid #000", padding: "8px", fontSize: "11px", textAlign: "center", lineHeight: "1.5" }} 
              />

              <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "12px", marginBottom: "4px" }}>Raw Status</div>
              <textarea 
                defaultValue={""} 
                style={{ width: "100%", height: "40px", resize: "none", border: "2px solid #000", padding: "8px" }} 
              />
            </div>

            {/* Footer Actions */}
            <div style={{ padding: "16px", borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", background: "#f8f9fa" }}>
              <button 
                onClick={() => setSelectedRow(null)}
                style={{ background: "#d9534f", color: "#fff", border: "none", padding: "8px 24px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Email Popup ── */}
      {showEmailPopup && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", justifyContent: "center", alignItems: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
          <div style={{
            background: "#fff", width: "550px", maxWidth: "95vw",
            maxHeight: "95vh", overflow: "auto", borderRadius: "4px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ textAlign: "center", fontSize: "22px", fontWeight: "600", padding: "16px 0", color: "#444" }}>
              Customer Defaults
            </div>
            <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "12px", color: "#333" }}>
              
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ background: "#f1f3f5", border: "1px solid #ced4da", padding: "6px 12px", width: "130px", borderRight: "none", fontSize: "13px", color: "#555" }}>Sites:</div>
                <select style={{ flex: 1, border: "1px solid #ced4da", padding: "6px", fontSize: "13px", maxWidth: "200px" }}>
                  <option></option>
                </select>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ background: "#f1f3f5", border: "1px solid #ced4da", padding: "8px 12px", width: "130px", borderRight: "none", fontSize: "13px", color: "#c92a2a" }}>Email To:</div>
                  <textarea style={{ flex: 1, border: "1px solid #ced4da", minHeight: "40px", padding: "6px", fontSize: "13px", resize: "vertical" }} />
                </div>
                <div style={{ fontSize: "11px", fontStyle: "italic", color: "#666", marginTop: "4px" }}>Enter all email addresses separated by commas.</div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ background: "#f1f3f5", border: "1px solid #ced4da", padding: "8px 12px", width: "130px", borderRight: "none", fontSize: "13px", color: "#1864ab" }}>CC Email To:</div>
                  <textarea style={{ flex: 1, border: "1px solid #ced4da", minHeight: "40px", padding: "6px", fontSize: "13px", resize: "vertical" }} />
                </div>
                <div style={{ fontSize: "11px", fontStyle: "italic", color: "#666", marginTop: "4px" }}>Enter all email addresses separated by commas.</div>
              </div>

              <div style={{ display: "flex", alignItems: "stretch" }}>
                <div style={{ background: "#f1f3f5", border: "1px solid #ced4da", padding: "8px 12px", width: "130px", borderRight: "none", fontSize: "13px", color: "#1864ab" }}>Email Subject:</div>
                <input style={{ flex: 1, border: "1px solid #ced4da", padding: "6px", fontSize: "13px" }} />
              </div>

              <div style={{ display: "flex", alignItems: "stretch" }}>
                <div style={{ background: "#f1f3f5", border: "1px solid #ced4da", padding: "8px 12px", width: "130px", borderRight: "none", fontSize: "13px", color: "#c92a2a" }}>Email Body:</div>
                <textarea style={{ flex: 1, border: "1px solid #000", minHeight: "220px", padding: "6px", fontSize: "13px", resize: "vertical" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ background: "#f1f3f5", border: "1px solid #ced4da", padding: "6px 12px", width: "130px", borderRight: "none", fontSize: "13px", color: "#1864ab" }}>Excel Sort Column:</div>
                <select style={{ flex: 1, border: "1px solid #ced4da", padding: "6px", fontSize: "13px", maxWidth: "250px" }}>
                  <option></option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <div style={{ background: "#f1f3f5", border: "1px solid #ced4da", padding: "4px 8px", fontSize: "13px", color: "#1864ab" }}>House Account:</div>
                <input type="checkbox" />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <div style={{ background: "#f1f3f5", border: "1px solid #ced4da", padding: "4px 8px", fontSize: "13px", color: "#1864ab" }}>Send as Zip File:</div>
                <input type="checkbox" />
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "16px" }}>
                <button style={{ background: "#4bc2c9", color: "#fff", border: "none", borderRadius: "4px", padding: "10px 16px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>Save Customer Defaults</button>
                <button onClick={() => setShowEmailPopup(null)} style={{ background: "#de4a4a", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 24px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>Back</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
