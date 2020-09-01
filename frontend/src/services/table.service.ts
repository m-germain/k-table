import { MTable } from "../models";
import db from "../plugins/firebase";
import Vue from "vue";

export const tables = db.collection("tables");

const TableService = {


    // Kind of useless.
    getTables: async function (): Promise<MTable[]> {
        const tablessArray: MTable[] = [];
        tables.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const table: MTable = {
                    id: doc.id,
                    name: doc.data().name,
                    available: doc.data().available,
                    help: doc.data().help,
                    token: doc.data().token,
                }
                tablessArray.push(table);
            })
        }).catch(error => {
            throw new Error('Could not get any Tables from the serveur.' + error)
        })
        return tablessArray;
    },

    getTableByNumber: async function (tableNumber: number): Promise<MTable> {
        const tablesArray: MTable[] = [];
        await tables.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const table: MTable = {
                    id: doc.id,
                    name: doc.data().name,
                    available: doc.data().available,
                    help: doc.data().help,
                    token: doc.data().token,
                }
                if (table.name === tableNumber) {
                    tablesArray.push(table);
                }
            })
        }).catch(error => {
            throw new Error('Could not get any Tables from the serveur.' + error)
        })
        if (tablesArray.length > 0) {
            return tablesArray[0];
        } else throw new Error('Could not get any Tables from the serveur.');
    },

    addTable: async function (tableList: MTable[]) {
        // We could specify the id of the docuement and use the table number as ID.
        // But for now we will not do this.
        tables.add({
            name: (tableList.length + 1),
            available: true,
            help: false,
            token: "",
        }).then(docRef => {
            Vue.toasted.global.success({ message: "Table ajoutée." })
            return docRef.id
        }).catch(error => {
            Vue.toasted.global.error({ message: "Erreur de l'ajout de table sur le serveur." })
            throw new Error('Could not add this Table to the serveur.' + error)
        })
    },

    removeTable: async function (tableList: MTable[]) {
        const lastTable = tableList.find(table => {
            return table.name === tableList.length
        })

        // If the table is unavailable we have clients on it and don't want to delete it.
        if (lastTable && lastTable.available)
            tables.doc(lastTable.id).delete()
                .then(() => {
                    Vue.toasted.global.success({ message: "Table suprimée." })
                    return lastTable.id
                })
                .catch(error => {
                    Vue.toasted.global.error({ message: "Erreur de la suppresion de cette table sur le serveur." })
                    throw new Error('Could not remove this Table to the serveur.' + error)
                })
        else {
            Vue.toasted.global.error({ message: "Tu dois d'abord libérer la table avant de la supprimer." })
            throw new Error('Could not remove this Table, we have clients ordering on this table!')
        }
    },

    askHelp: async function (id: string) {
        tables.doc(id).update({
            help: true
        }).then(() => {
            Vue.toasted.global.success({ message: "Appel enregistré, veuillez patienter." })
        }).catch(error => {
            Vue.toasted.global.error({ message: "Erreur lors de l'Appel, veuillez patienter." })
            throw new Error('Could not ask for help.' + error)
        })
    },

    resolveHelp: async function (id: string) {
        tables.doc(id).update({
            help: false
        }).then(() => {
            Vue.toasted.global.success({ message: "Changement enregistré !" })
        }).catch(error => {
            Vue.toasted.global.error({ message: "Erreur lors du changement d'etat Aide !" })
            throw new Error('Could resolve help.' + error)
        })
    },

    liberateTable: async function (id: string) {
        tables.doc(id).update({
            available: true,
            token: ""
        }).then(() => {
            Vue.toasted.global.success({ message: "Table Libérée !" })
            return id
        }).catch(error => {
            throw new Error('Could liberate table.' + error)
        })
    },

    activateTable: async function (id: string, token: string) {
        tables.doc(id).update({
            available: false,
            token: token,
        }).then(() => {
            Vue.toasted.global.success({ message: "Table Activée !" })
        }).catch(error => {
            Vue.toasted.global.error({ message: "Erreur Imposible d'activer la table !" })
            throw new Error('Could liberate table.' + error)
        })
    },

}

export default TableService;