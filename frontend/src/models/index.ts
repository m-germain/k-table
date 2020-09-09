export interface MProduct {
    id: string;
    name: string;
    price: number;
    alcohol: number;
    description: string;
    pictureUrl: string;
    available: boolean;
    categorie: MCategorie;
}

export interface MTable {
    id: string;
    name: number;
    clientsAtTable: string;
    clientName: string;
    minor: boolean;
    available: boolean;
    help: boolean;
    token: string;
}

export interface MOrder {
    id: string;
    orderCode: string;
    client: MUserData;
    timestamp: Date;
    state: string;
    lineItems: MLineItem[];
}

export interface MLineItem {
    product: MProduct;
    quantity: number;
}

export interface MUserData { username?: string; clientsAtTable?: string; tableId?: string; table?: string; minor?: boolean; iat?: number; exp?: number }


export const Categories: MCategorie[] = [
    { name: "Recommended", icon: "mdi-star" },
    { name: "Tap Beers", icon: "mdi-beer" },
    { name: "Bottled Beers", icon: "mdi-bottle-soda" },
    { name: "Wines", icon: "mdi-bottle-wine" },
    { name: "Softs", icon: "mdi-cup-water" },
    { name: "Foods", icon: "mdi-food-fork-drink" },
]
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
}


// Form Validation Types 
// Permet de créer un type Form et réaliser les méthodes suivantes sur cet Object
export type VForm = Vue & {
    validate: () => boolean;
    resetValidation: () => boolean;
    reset: () => void;
};