// import jwt_decode from 'jwt-decode'; /// IL faut @types/jwt-decode
import jwt from "jsonwebtoken";

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
        // if (token && this.isTokenExpired(token)) {
        //     this.removeToken;
        //     return '';
        // } else return token
    },

    saveToken(accessToken: string) {
        localStorage.setItem(TOKEN_KEY, accessToken)
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    },

    // isTokenExpired(token: string) {
    //     try {
    //         // const date = new Date(0);
    //         // const decoded: Token = jwt_decode(token);
    //         // return decoded.exp < new Date().valueOf() / 1000;
    //     } catch (err) {
    //         return false;
    //     }
    // },

    generateToken(username: string, tableId: string, table: string): string {
        const token = jwt.sign({ username: username, tableId: tableId, table: table }, 'scret-key-mdr', { expiresIn: '4h' });
        return token;
    }

}

export default TokenService;