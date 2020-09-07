import Vue from 'vue'
import Component from 'vue-class-component'
import { MTable } from '@/models';
import TableService, { tables } from "../services/table.service";

@Component
export default class TableHelper extends Vue {
  private tables: MTable[] = [];
  private loading = false;

  async getTables() {
    this.realTimeListenner();
  }

  //Listen to the db and fetch the changes on all devices.
  realTimeListenner() {
    //Ref to the collection in table service.
    //Local tables array. Bcs I Can't acces to this.tables mdr
    const localTables: MTable[] = [];
    tables.orderBy("name").onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        const table: MTable = {
          id: change.doc.id,
          name: change.doc.data().name,
          clientsAtTable: change.doc.data().clientsAtTable,
          clientName: change.doc.data().clientName,
          available: change.doc.data().available,
          help: change.doc.data().help,
          token: change.doc.data().token,
        }
        if (change.type === "added") {
          localTables.push(table);
        }
        if (change.type === "modified") {
          const index = localTables.findIndex(item => item.id == table.id)
          localTables.splice(index, 1, table)
        }
        if (change.type === "removed") {
          const index = localTables.findIndex(item => item.id == table.id)
          if (index >= 0) {
            localTables.splice(index, 1)
          }
        }
      });
    });
    this.tables = localTables;
  }

  get numberOfTables() {
    return this.tables.length;
  }

  get numberOfTablesAvailable() {
    return this.tablesAvailable.length;
  }

  get tablesAvailable() {
    const tablesAvailable: MTable[] = []
    for (const table of this.tables) {
      if (table.available) {
        tablesAvailable.push(table);
      }
    }
    return tablesAvailable;
  }

  get tablesInNeed() {
    const tablesInNeed: MTable[] = []
    for (const table of this.tables) {
      if (table.help) {
        tablesInNeed.push(table);
      }
    }
    return tablesInNeed;
  }

  addTable() {
    this.blockActions();
    TableService.addTable();
  }

  removeTable() {
    this.blockActions();
    TableService.removeTable();
  }

  get available() {
    return this.numberOfTablesAvailable > 0;
  }

  blockActions() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 600);
  }

}