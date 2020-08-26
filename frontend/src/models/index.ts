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
    table: number;
    timestamp: Date;
    completed: boolean;
    clientToken: string;
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


// Form Validation Types 
// Permet de créer un type Form et réaliser les méthodes suivantes sur cet Object
export type VForm = Vue & {
    validate: () => boolean;
    resetValidation: () => boolean;
    reset: () => void;
};