/**
 * Plain-data description of the 3D model shown for each product range.
 * No three.js import here, so the page UI can read it without loading the 3D chunk.
 * Dimensions are in metres and are illustrative, not catalogue sizes.
 */
export type DoorModel = {
  kind: "door";
  /** Hinged leaves in the opening. */
  leaves: 1 | 2;
  /** Clear opening width and height. */
  w: number;
  h: number;
  /** Glazing grid per leaf. */
  rows: number;
  cols: number;
  /** Fixed glazed band above the door. */
  transom?: number;
  transomCols?: number;
  /** Fixed glazed panels beside the door. */
  sideL?: number;
  sideR?: number;
  sideCols?: number;
  /** Height of a solid lower panel on each leaf. */
  kick?: number;
  /** Mid rail near the bottom with a small solid panel under it. */
  kickRail?: boolean;
  glass?: boolean;
  /** Safety grill bars over the glazed area. */
  grill?: boolean;
  pattern?: "grid" | "diamond";
  /** Semi-circular fanlight instead of a rectangular transom. */
  arch?: boolean;
  pushBar?: boolean;
  /** Window: stone sill and wall apron instead of a threshold. */
  sill?: boolean;
  /** Standing figure for scale. */
  figure?: boolean;
};

export type BenchModel = { kind: "bench" };

export type ProductModel = (DoorModel | BenchModel) & {
  /** One line under the viewer saying what is modelled. */
  caption: string;
  /** Labels for the open/close toggle; omitted when nothing opens. */
  toggle?: [open: string, close: string];
};

export const productModels: Record<string, ProductModel> = {
  "combination-doors": {
    kind: "door",
    leaves: 2,
    w: 1.5,
    h: 2.1,
    rows: 4,
    cols: 2,
    transom: 0.4,
    sideL: 0.5,
    sideR: 0.5,
    kickRail: true,
    caption: "Double door with fixed side panels and a glazed transom.",
    toggle: ["Open the doors", "Close the doors"],
  },
  "customise-doors": {
    kind: "door",
    leaves: 1,
    w: 1.0,
    h: 2.1,
    rows: 3,
    cols: 2,
    transom: 0.38,
    transomCols: 3,
    sideL: 0.62,
    kickRail: true,
    caption: "Single door with one fixed side panel: one of many layouts made to your opening.",
    toggle: ["Open the door", "Close the door"],
  },
  "designer-doors": {
    kind: "door",
    leaves: 2,
    w: 1.7,
    h: 2.05,
    rows: 3,
    cols: 1,
    pattern: "diamond",
    arch: true,
    kickRail: true,
    caption: "Double door with a diamond grid and an arched fanlight.",
    toggle: ["Open the doors", "Close the doors"],
  },
  "commercial-doors": {
    kind: "door",
    leaves: 2,
    w: 2.2,
    h: 2.3,
    rows: 1,
    cols: 1,
    transom: 0.45,
    transomCols: 2,
    pushBar: true,
    kickRail: true,
    caption: "Wide full-glass entrance with push bars and a transom.",
    toggle: ["Open the doors", "Close the doors"],
  },
  "safety-doors": {
    kind: "door",
    leaves: 1,
    w: 1.05,
    h: 2.1,
    rows: 1,
    cols: 1,
    kick: 0.62,
    glass: false,
    grill: true,
    caption: "Grill door with a solid lower panel and lock box.",
    toggle: ["Open the door", "Close the door"],
  },
  "french-windows": {
    kind: "door",
    leaves: 2,
    w: 1.5,
    h: 1.35,
    rows: 3,
    cols: 2,
    sill: true,
    caption: "Two-leaf French window on a stone sill.",
    toggle: ["Open the window", "Close the window"],
  },
  "garden-benches": {
    kind: "bench",
    caption: "Slatted steel garden bench.",
  },
  "xxl-doors": {
    kind: "door",
    leaves: 2,
    w: 2.0,
    h: 2.75,
    rows: 5,
    cols: 2,
    sideL: 0.95,
    sideR: 0.95,
    sideCols: 2,
    kickRail: true,
    figure: true,
    caption: "Extra-tall four-panel wall of glass, shown beside a 1.7 m figure for scale.",
    toggle: ["Open the doors", "Close the doors"],
  },
};

/** Powder-coat previews. Illustrative only: the current shade card comes from the sales team. */
export const finishes = [
  { name: "Midnight Navy", value: "#141f38" },
  { name: "Jet Black", value: "#17181c" },
  { name: "Graphite", value: "#4b5059" },
  { name: "Ivory", value: "#e9e4d8" },
  { name: "Bronze", value: "#6a4a2f" },
  { name: "Forest", value: "#1f3b2e" },
] as const;
