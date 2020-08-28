import { MTable } from "../models";
import db from "../plugins/firebase";

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
            console.log("Success Add new Table Id :" + docRef.id);
        }).catch(error => {
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
                    console.log("Table Deleted" + lastTable.id);
                })
                .catch(error => {
                    throw new Error('Could not remove this Table to the serveur.' + error)
                })
        else throw new Error('Could not remove this Table, we have clients ordering on this table!')
    },

    askHelp: async function (id: string) {
        tables.doc(id).update({
            help: true
        }).then(() => {
            console.log("Help Asked for table" + id);
        }).catch(error => {
            throw new Error('Could not ask for help.' + error)
        })
    },

    resolveHelp: async function (id: string) {
        tables.doc(id).update({
            help: false
        }).then(() => {
            console.log("Table" + id + " helped");
        }).catch(error => {
            throw new Error('Could resolve help.' + error)
        })
    },

    liberateTable: async function (id: string) {
        tables.doc(id).update({
            available: true,
            token: ""
        }).then(() => {
            console.log("Table" + id + " liberated");
        }).catch(error => {
            throw new Error('Could liberate table.' + error)
        })
    }

}

export default TableService;