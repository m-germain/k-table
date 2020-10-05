export interface MProduct {
  id: string;
  name: string;
  price: number;
  alcohol: number;
  description: string;
  pictureUrl: string;
  available: boolean;
  categorie: MCategorie;
  association: boolean;
}

export interface MTable {
  id: string;
  name: number;
  capacity: number;
  client: MUserData;
  available: boolean;
  help: MHelp;
  token: string;
}

export interface MOrder {
  id: string;
  orderCode: string;
  client: MUserData;
  timestamp: Date;
  message: string;
  state: string;
  lineItems: MLineItem[];
  association: boolean;
}

export interface MLineItem {
  product: MProduct;
  quantity: number;
}

export interface MUserData {
  username: string;
  clientsAtTable: number;
  minor: number;
  tableId?: string;
  table?: string;
  iat?: number;
  exp?: number;
}

export const Categories: MCategorie[] = [
  { name: "Recommended", icon: "mdi-star" },
  { name: "Tap Beers", icon: "mdi-beer" },
  { name: "Bottled Beers", icon: "mdi-bottle-soda" },
  { name: "Wines", icon: "mdi-bottle-wine" },
  { name: "Softs", icon: "mdi-cup-water" },
  { name: "Foods", icon: "mdi-food-fork-drink" },
];
export interface MCategorie {
  icon: string;
  name: string;
}

export const OrderStates = {
  placed: "PLACED",
  preparated: "PREPARATED",
  served: "SERVED",
  payed: "PAYED",
  canceled: "CANCELED",
};

export const HelpStates = {
  activationTable: {
    state: "ACTIVATION_TABLE",
    color: "warning",
    message: "Demmande d'activation",
  },
  leaveTable: {
    state: "LEAVE_TABLE",
    color: "brown darken-2",
    message: "Demmande Jetons",
  },
  helpInOrder: {
    state: "HELP_IN_ORDER",
    color: "indigo darken-2",
    message: "Besoin d'aide Commande",
  },
  helpTableLock: {
    state: "HELP_TABLE_LOCK",
    color: "pink  lighten-3",
    message: "Problème De Télephone",
  },
  noNeed: { state: "NO_NEED", color: "success", message: "Tout est OK" },
};

export interface MHelp {
  type: MHelpType;
  timestamp: FirebaseDateFormat;
}

// Firebase use a differents Date Object dans JS Date.
// So sometime is better to save it like this to access the date later ON.
export interface FirebaseDateFormat {
  nanoseconds: number;
  seconds: number;
}

export interface MHelpType {
  state: string;
  color: string;
  message: string;
}

// Form Validation Types
// Permet de créer un type Form et réaliser les méthodes suivantes sur cet Object
export type VForm = Vue & {
  validate: () => boolean;
  resetValidation: () => boolean;
  reset: () => void;
};
