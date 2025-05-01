import { jwtDecode } from "jwt-decode";

export function tokenDecoder(token: string) {
    if(token) {
        const decoded = jwtDecode(token);

        return decoded;
    } else 
    return {
        success: false,
        message: 'Tokendecode: Token invalid'
    }

}
