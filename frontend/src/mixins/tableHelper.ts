import Vue from "vue";
import Component from "vue-class-component";
import { HelpStates, MTable } from "@/models";
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
    tables.orderBy("name").onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        const table: MTable = {
          id: change.doc.id,
          name: change.doc.data().name,
          client: change.doc.data().client,
          capacity: change.doc.data().capacity,
          available: change.doc.data().available,
          help: change.doc.data().help,
          token: change.doc.data().token,
        };
        if (change.type === "added") {
          localTables.push(table);
        }
        if (change.type === "modified") {
          const index = localTables.findIndex((item) => item.id == table.id);
          localTables.splice(index, 1, table);
        }
        if (change.type === "removed") {
          const index = localTables.findIndex((item) => item.id == table.id);
          if (index >= 0) {
            localTables.splice(index, 1);
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

  get numberOfPlacesAvailable() {
    let count = 0;
    this.tablesAvailable.forEach((table: MTable) => {
      count += parseInt(table.capacity.toString());
    });
    return count;
  }

  get tablesAvailable() {
    const tablesAvailable: MTable[] = [];
    for (const table of this.tables) {
      // We want to know was tables are available, Also we don't want to count tables that are waiting for activations.
      // Bcs if they are waiting for activation this mean that someone is on the table.
      if (
        table.available &&
        table.help.type.state != HelpStates.activationTable.state
      ) {
        tablesAvailable.push(table);
      }
    }
    return tablesAvailable;
  }

  get tablesInNeed() {
    const tablesInNeed: MTable[] = [];
    for (const table of this.tables) {
      if (table.help.type.state !== HelpStates.noNeed.state) {
        tablesInNeed.push(table);
      }
    }
    // We sort it by timestamp. to diplay the oldest help request on top.
    tablesInNeed.sort((a: MTable, b: MTable) => {
      const timestampA = new Date(a.help.timestamp.seconds * 1000);
      const timestampB = new Date(b.help.timestamp.seconds * 1000);
      return timestampA.getTime() - timestampB.getTime();
    });
    console.log(tablesInNeed);

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

  blockTables() {
    this.tables.forEach((table) => {
      TableService.blockTable(table.id);
    });
  }
  freshStart() {
    this.tables.forEach((table) => {
      TableService.liberateTable(table.id);
    });
  }
}
