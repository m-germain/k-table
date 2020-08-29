// import jwt_decode from 'jwt-decode'; /// IL faut @types/jwt-decode
import jwt from "jsonwebtoken";
import { MUserData, MTable } from "../models";
import TableService, { tables } from "./table.service";

const TOKEN_KEY = 'access_token'

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

    saveToken(accessToken: string) {
        localStorage.setItem(TOKEN_KEY, accessToken)
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    },

    generateToken(username: string, tableId: string, table: string): string {
        const token = jwt.sign({ username: username, tableId: tableId, table: table }, 'scret-key-mdr', { expiresIn: '4h' });
        return token;
    },

    async decode(token: string): Promise<MUserData> {
        const decoded: MUserData = jwt.verify(token, 'scret-key-mdr') as MUserData;
        if (decoded) {
            this.saveToken(token);
            return decoded;
        } else throw new Error("Oups, something went wrong...")
    },

    async getAndDecodeToken(): Promise<MUserData> {
        // Get the token in storage, 
        // If good retrive the user datas.
        // Else we clean the localstorage of the fake or expiered token.
        let localUserData: MUserData = {}
        const token = this.getToken() as string;

        if (token) {
            console.log('token detected');
            //Decode data in Token.
            await this.decode(token).then((decodedUserData: MUserData) => {
                console.log('token decoded', decodedUserData);
                localUserData = decodedUserData as MUserData;
            }).catch(() => {
                console.log('token not decoded');
                // If we cant read the token we clear it from the user local storage.
                this.removeToken();
                throw new Error("Oups, your token cannot be decoded...")
            });
            await this.verifyTableToken(localUserData.tableId as string, token).then((resp: boolean) => {
                if (resp) {
                    console.log('token is validated in db');
                } else throw new Error("Oups, this token is no more valid for this table...")
            })

        } else throw new Error("Oups, no token found...")
        return localUserData;
    },

    async verifyTableToken(tableId: string, token: string): Promise<boolean> {
        let isVerified = false;
        await tables.doc(tableId).get().then(function (doc) {
            console.log(doc.data());
            if (doc.exists) {
                const table = doc.data() as MTable;
                if (table.token === token && doc.id === tableId) {
                    isVerified = true;
                }
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        return isVerified;
    }

}

export default TokenService;