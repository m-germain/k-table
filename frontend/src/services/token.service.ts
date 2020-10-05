// import jwt_decode from 'jwt-decode'; /// IL faut @types/jwt-decode
import jwt from "jsonwebtoken";
import { MUserData, MTable } from "../models";
import { tables } from "./table.service";

// Admin Checker.
import db from "../plugins/firebase";
export const admin = db.collection("admin");
export const association = db.collection("association");

const TOKEN_KEY = "access_token";
const ADMIN_TOKEN_KEY = "admin_token";

const SECRET_KEY = "all_secured_in_bd_no_secret_here";

export interface Token {
  exp: number;
}

/**
 * Manage the how Access Tokens are being stored and retreived from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instace.
 **/
const TokenService = {
  getToken() {
    const token = localStorage.getItem(TOKEN_KEY) as string;
    return token;
  },

  async getAdminToken(): Promise<string> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) as string;
    if (token) {
      // The decode func is great bcs is doing the check and the clear for us.
      await this.decode(token).catch((error) => {
        // This error can only be that the token is no more valid.
        // We pass the error to redirect the user.
        throw new Error(error);
      });
      return token;
    } else {
      throw new Error("No token in local storage.");
    }
  },

  saveAdminToken(adminToken: string) {
    localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
  },

  removeAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  saveToken(accessToken: string) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  generateToken(
    username: string,
    clientsAtTable: number,
    minor: number,
    tableId: string,
    table: string
  ): string {
    if (SECRET_KEY) {
      const token = jwt.sign(
        {
          username: username,
          clientsAtTable: clientsAtTable,
          minor: minor,
          tableId: tableId,
          table: table,
        },
        SECRET_KEY,
        { expiresIn: "4h" }
      );
      return token;
    } else throw new Error("Oups, No Secret KEY for TOKEN GENERATION...");
  },

  async decode(token: string): Promise<MUserData> {
    if (SECRET_KEY) {
      const decoded: MUserData = jwt.verify(token, SECRET_KEY) as MUserData;
      if (decoded) {
        if (decoded.username === "admin") {
          await this.checkAdminToken(token).then((resp: boolean) => {
            // If false
            if (resp) {
              this.saveAdminToken(token);
              // If token has been invalidated we clear it from the local storage
            } else {
              this.removeAdminToken();
              throw new Error("Oups, not a valid admin token...");
            }
          });
        } else {
          this.saveToken(token);
        }
        return decoded;
      } else throw new Error("Oups, something went wrong...");
    } else throw new Error("Oups, No Secret KEY for TOKEN DECODE...");
  },

  async getAndDecodeToken(): Promise<MUserData> {
    // Get the token in storage,
    // If good retrive the user datas.
    // Else we clean the localstorage of the fake or expiered token.
    let localUserData: MUserData = {
      username: "",
      clientsAtTable: 0,
      minor: 0,
    };
    const token = this.getToken() as string;

    if (token) {
      //Decode data in Token.
      await this.decode(token)
        .then((decodedUserData: MUserData) => {
          localUserData = decodedUserData as MUserData;
        })
        .catch(() => {
          // If we cant read the token we clear it from the user local storage.
          this.removeToken();
          throw new Error("Oups, your token cannot be decoded...");
        });
      if (localUserData.table == "association") {
        await this.checkAssociationToken(token).then((resp: boolean) => {
          // If False.
          if (!resp) {
            // If token has been invalidated we clear it from the local storage
            // this.removeToken();
            throw new Error(
              "Oups, this token is no more valid for this association..."
            );
          }
        });
      } else {
        await this.verifyTableToken(
          localUserData.tableId as string,
          token
        ).then((resp: boolean) => {
          // If False.
          if (!resp) {
            // If token has been invalidated we clear it from the local storage
            this.removeToken();
            throw new Error(
              "Oups, this token is no more valid for this table..."
            );
          }
        });
      }
    } else throw new Error("Oups, no token found...");
    return localUserData;
  },

  async verifyTableToken(tableId: string, token: string): Promise<boolean> {
    let isVerified = false;
    await tables
      .doc(tableId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const table = doc.data() as MTable;
          if (table.token === token && doc.id === tableId) {
            isVerified = true;
          }
        }
      })
      .catch(function(error) {
        throw new Error("Error getting document:" + error);
      });
    return isVerified;
  },

  async checkAdminToken(token: string): Promise<boolean> {
    let isVerified = false;
    await admin
      .doc(token)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          isVerified = true;
        }
      })
      .catch(function(error) {
        throw new Error("Error getting document:" + error);
      });
    return isVerified;
  },

  async checkAssociationToken(token: string): Promise<boolean> {
    let isVerified = false;
    await association
      .doc(token)
      .get()
      .then((doc) => {
        if (doc.id === token) {
          isVerified = true;
        }
      })
      .catch(function(error) {
        throw new Error("Error getting document:" + error);
      });
    console.log(isVerified);

    return isVerified;
  },

  async isAssociationTokeninDB(): Promise<{ token: string; user: MUserData }> {
    // Get the token in BD,
    // If good retrive the user datas.
    // Else we clean the BD of the fake or expiered token.
    let localUserData: MUserData = {
      username: "",
      clientsAtTable: 0,
      minor: 0,
    };
    let token = "";
    await association
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if (doc.id) {
            //Decode data in Token.
            await this.decode(doc.id)
              .then((decodedUserData: MUserData) => {
                token = doc.id;
                localUserData = decodedUserData as MUserData;
              })
              .catch((error) => {
                // If we cant read the token we clear it from the user local storage.
                association.doc(doc.id).delete();
                throw new Error(error);
              });
          } else throw new Error("Oups, no token found...");
        });
      })
      .catch(function(error) {
        throw new Error("Error getting document:" + error);
      });
    return { token: token, user: localUserData };
  },

  async activateAssociation(token: string): Promise<boolean> {
    let isDone = false;
    await association
      .add({
        id: token,
      })
      .then(() => {
        isDone = true;
      })
      .catch((error) => {
        throw new Error("Error creating document:" + error);
      });
    return isDone;
  },

  async desactivateAssociation(token: string): Promise<boolean> {
    let isDone = false;
    await association
      .doc(token)
      .delete()
      .then(() => {
        isDone = true;
      })
      .catch((error) => {
        throw new Error("Error getting document:" + error);
      });
    return isDone;
  },
};

export default TokenService;
