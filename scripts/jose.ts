import {SignJWT, jwtVerify} from 'jose';
import crypto from "crypto";

const secret = new TextEncoder().encode('SECRET_STRING')
const token = await new SignJWT({ sid: "somesidhererererere" })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret)

console.log({token});

const payload = await jwtVerify(token, secret)
console.log({payload})

console.time("prime generate");
const arbitre = crypto.createDiffieHellman(512);
console.timeEnd("prime generate");
