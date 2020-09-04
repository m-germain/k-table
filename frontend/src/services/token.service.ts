// import jwt_decode from 'jwt-decode'; /// IL faut @types/jwt-decode
import jwt from "jsonwebtoken";
import { MUserData, MTable } from "../models";
import { tables } from "./table.service";

// Admin Checker.
import db from "../plugins/firebase";
export const admin = db.collection("admin");

const TOKEN_KEY = 'access_token';
const ADMIN_TOKEN_KEY = 'admin_token';

const SECRET_KEY = 'all_secured_in_bd_no_secret_here';



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

    getAdminToken() {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY) as string;
        return token;
    },

    saveAdminToken(adminToken: string) {
        localStorage.setItem(ADMIN_TOKEN_KEY, adminToken)
    },

    removeAdminToken() {
        localStorage.removeItem(ADMIN_TOKEN_KEY)
    },

    saveToken(accessToken: string) {
        localStorage.setItem(TOKEN_KEY, accessToken)
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    },

    generateToken(username: string, clientsAtTable: string, tableId: string, table: string): string {
        if (SECRET_KEY) {
            const token = jwt.sign({ username: username, clientsAtTable: clientsAtTable, tableId: tableId, table: table }, SECRET_KEY, { expiresIn: '4h' });
            return token;
        } else throw new Error("Oups, No Secret KEY for TOKEN GENERATION...")
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
                            throw new Error("Oups, not a valid admin token...")
                        }
                    })
                } else {
                    this.saveToken(token);
                }
                return decoded;
            } else throw new Error("Oups, something went wrong...")
        } else throw new Error("Oups, No Secret KEY for TOKEN DECODE...")
    },

    async getAndDecodeToken(): Promise<MUserData> {
        // Get the token in storage, 
        // If good retrive the user datas.
        // Else we clean the localstorage of the fake or expiered token.
        let localUserData: MUserData = {}
        const token = this.getToken() as string;

        if (token) {
            //Decode data in Token.
            await this.decode(token).then((decodedUserData: MUserData) => {
                localUserData = decodedUserData as MUserData;
            }).catch(() => {
                // If we cant read the token we clear it from the user local storage.
                this.removeToken();
                throw new Error("Oups, your token cannot be decoded...")
            });
            await this.verifyTableToken(localUserData.tableId as string, token).then((resp: boolean) => {
                // If False.
                if (!resp) {
                    // If token has been invalidated we clear it from the local storage
                    this.removeToken();
                    throw new Error("Oups, this token is no more valid for this table...")
                }
            })

        } else throw new Error("Oups, no token found...")
        return localUserData;
    },

    async verifyTableToken(tableId: string, token: string): Promise<boolean> {
        let isVerified = false;
        await tables.doc(tableId).get().then(function (doc) {
            if (doc.exists) {
                const table = doc.data() as MTable;
                if (table.token === token && doc.id === tableId) {
                    isVerified = true;
                }
            }
        }).catch(function (error) {
            throw new Error("Error getting document:" + error)
        });
        return isVerified;
    },

    async checkAdminToken(token: string): Promise<boolean> {
        let isVerified = false;
        await admin.doc(token).get().then(function (doc) {
            if (doc.exists) {
                isVerified = true;
            }
        }).catch(function (error) {
            throw new Error("Error getting document:" + error)
        });
        return isVerified;
    },

}

export default TokenService;