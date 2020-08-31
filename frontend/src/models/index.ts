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

export interface MTable {
    id: string;
    name: number;
    available: boolean;
    help: boolean;
    token: string;
}

export interface MUserData { username?: string; tableId?: string; table?: string; iat?: number; exp?: number }


export const Categories: MCategorie[] = [
    { name: "Beers", icon: "mdi-beer" },
    { name: "Softs", icon: "mdi-cup-water" },
    { name: "Foods", icon: "mdi-food-fork-drink" },
    { name: "Recommended", icon: "mdi-star" }
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