import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import https from "https";
import cors from "cors";
import twilio from "twilio";

const app = express();
const port = 3000;
let valorCompra = 0;

app.use(cors());
app.use(bodyParser.json());

const baseUrl = "https://apislab.daviplata.com";
function sslConfiguredAgent() {
  const options = {
    cert:
      "-----BEGIN CERTIFICATE-----\r\n" +
      "MIID6TCCAtGgAwIBAgIUVDVOrxZBB90pqoS0YfINUfOa5dMwDQYJKoZIhvcNAQEL\r\n" +
      "BQAwgYMxCzAJBgNVBAYTAkNPMQ8wDQYDVQQIDAZCb2dvdGExDzANBgNVBAcMBkJv\r\n" +
      "Z290YTETMBEGA1UECgwKRGF2aXZpZW5kYTEYMBYGA1UECwwPQVBJIExhYm9yYXRv\r\n" +
      "cmlvMSMwIQYDVQQDDBpDbGllbnQgVExTIEFQSSBMYWJvcmF0b3JpbzAeFw0yMzAx\r\n" +
      "MDIxNTI2NTBaFw0yNTAzMTIxNTI2NTBaMIGDMQswCQYDVQQGEwJDTzEPMA0GA1UE\r\n" +
      "CAwGQm9nb3RhMQ8wDQYDVQQHDAZCb2dvdGExEzARBgNVBAoMCkRhdml2aWVuZGEx\r\n" +
      "GDAWBgNVBAsMD0FQSSBMYWJvcmF0b3JpbzEjMCEGA1UEAwwaQ2xpZW50IFRMUyBB\r\n" +
      "UEkgTGFib3JhdG9yaW8wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCd\r\n" +
      "L8srLvZy63FNeFqmlWFuu3UyaXQU2KoVFBqlIVzVtygmQQYJF22PGDwWnr3HD8vE\r\n" +
      "TQFaWY+u4TfDEVeOHcZInbiQr1t6ou6tW8G7KUtHMMdNtJn0ZXjH0CNxyAyIZgR9\r\n" +
      "4gMywIDI77vgTW3grFsWyNpNxIuZ2GW5m/wjaFXATIsehvHjk9BlEE2apyrVjAbP\r\n" +
      "bAsMgfbp6Z1I+/nfwuWh4qMRs5W2tDwL7inbYdM21pRTkz2uw0RS5rcbltxosbV/\r\n" +
      "ym+kf2Bj4F/naSxomf0d1y7uifHlPP1Pipr6LR1frCZRBeWFepNLPepCnkDMU8Lt\r\n" +
      "5WgstDmfMil8b/z6t2ALAgMBAAGjUzBRMB0GA1UdDgQWBBQeCVk0WYd4ZzoFPmZV\r\n" +
      "y/F/rXPZQTAfBgNVHSMEGDAWgBQeCVk0WYd4ZzoFPmZVy/F/rXPZQTAPBgNVHRMB\r\n" +
      "Af8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBkJB6RXwwrMI0sDJEggMbYW2bX\r\n" +
      "++VTCMQgTjkbs15B5Db63H7k+B0s2cN1H8ArONZrcWlRsYGj/LR6izyneL7dCB/M\r\n" +
      "ZUKj6icFp3q1VFzzpUPbRtCivYTPy+qkd2eKyZ2WN1EDs9ImxZa02LwsUWesVCrA\r\n" +
      "4yH18G8WBejaHactiZRatKEDxAJT/yJtN3dk+0ByDJ9rb3QeZn0JKj7BfF/2REw5\r\n" +
      "iulGLqUiDay5vIGW1s0QGsLSAufnPZ2cma+sVcMbGlqAtO1nGguiCad7sRTw2bZQ\r\n" +
      "Brtx0bE/DHtbVvmJd8hsHZYp8t+V2n1DQEsyJBrn/eQNXnaFF5NDEnq3hyQX\r\n" +
      "-----END CERTIFICATE-----\r\n",
    key:
      "-----BEGIN PRIVATE KEY-----\r\n" +
      "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCdL8srLvZy63FN\r\n" +
      "eFqmlWFuu3UyaXQU2KoVFBqlIVzVtygmQQYJF22PGDwWnr3HD8vETQFaWY+u4TfD\r\n" +
      "EVeOHcZInbiQr1t6ou6tW8G7KUtHMMdNtJn0ZXjH0CNxyAyIZgR94gMywIDI77vg\r\n" +
      "TW3grFsWyNpNxIuZ2GW5m/wjaFXATIsehvHjk9BlEE2apyrVjAbPbAsMgfbp6Z1I\r\n" +
      "+/nfwuWh4qMRs5W2tDwL7inbYdM21pRTkz2uw0RS5rcbltxosbV/ym+kf2Bj4F/n\r\n" +
      "aSxomf0d1y7uifHlPP1Pipr6LR1frCZRBeWFepNLPepCnkDMU8Lt5WgstDmfMil8\r\n" +
      "b/z6t2ALAgMBAAECggEAKmDJUNIvhZouiOlq30Ck7RrDJR1DO5+Sc25hJKYTBleE\r\n" +
      "DpQ3UVosooixIpQXrER49mqgc8BzuX1k8EWLqngijk9fhDqS2kR1Pu3fFFu0vPPM\r\n" +
      "uAl5/GcjIhPein2Zy2hdy6aUoClAT2w65eVaO1mckU8DdDYKQScTffAtEUq+28Ib\r\n" +
      "CSfaFZLBK2JWlbM7W9HGqmI4dlc3Kuk9AeYnmA74nd0lxKL7iHPeplWeaolO5Q2K\r\n" +
      "HtZgeBSV+bScyXFkAgaRIJeRg/gUzCY4cVAsT/lME0fIGfTd8YN3lgsXsNB0JrfZ\r\n" +
      "vUoLCoU/MxV+dTdLzzZr0NEWS4Zk50yWlz3IrS5maQKBgQDNjaJAcrdAYlch3Q2X\r\n" +
      "gxlC/baR9qqtzaPnLnbMjsHETMD6XHHqKQZAElBR4B9WT47d4MHtRjNqUgG0QGtc\r\n" +
      "RFpWVPy6PBZzBt4m8YJkt/D76aL8Tg4ehxXrXdKxisIA1RCP8gxI8LAB+7+0fuSI\r\n" +
      "XE9i+3T4nFYQpteBAbU3ATMs7QKBgQDDw2q5Y5Prj/r220LF6mr2hvL3DlcraChy\r\n" +
      "CK6uC4XsZLXPkdmRE4yHS4Rcm71yZNjUGe/hdlNJx3tlb6Wl2ZJPMsqMbRh16l/L\r\n" +
      "z08tG8fK2T8HnSbZ5YsKVIzXSESZ5Q92BAwjSd3E5lpxtVPK3BleUiNeeRMWjztZ\r\n" +
      "iIC7pQ+Z1wKBgQCx8j4XKvhHbZrevv5IPv78hqWpwO/LHK4asZe4yJEoPgYF90fK\r\n" +
      "ng9CIliUOMEIOEGHBU78+PwDu9Cr2eTXcHkAKfzLwL7yf2yMLCFkzfR6MK2fXHdO\r\n" +
      "qEUqiAOhHW2LyOfYpYNLFcpZPTadrAhtn/Q9zVBa9QRwz+7aSL83SfuilQKBgAHa\r\n" +
      "G2xdkMyttAYZ1OviZ9ilNi84J4L1nUxW4LAs07uEyGOKUbCZqr6s7DekEYq/gX2g\r\n" +
      "MTDE2czc4kH3aG3FPSkapefmMFENQpK/B1S56o30uC/uQKvXDBWw7xQqTtvV2uuW\r\n" +
      "5jZ/QGXYeAqTWJOWuXa2+DawlomkGT+jlvQvf5JJAoGBAJMoBvOLmjyTR5VGYOKd\r\n" +
      "TiOsu+YafRr/grmAXdKTbT3Ccz9DQwEL6j5mX/L4dQnGL+aV48tYxyoaZ4Kmj7Qr\r\n" +
      "gy/p4SveGr5kVTRz5mIPIfM9LEdDHOlQOVYjuA2pWEETAaaBIsIdUVQPGv7evFDw\r\n" +
      "LvWYBuU7xzPyNKo06LvBRuxE\r\n" +
      "-----END PRIVATE KEY-----",
  };
  return new https.Agent(options);
}

app.post("/generarToken", async (req, res) => {
  let grant_type = req.body.grant_type;
  let client_id = req.body.client_id;
  let client_secret = req.body.client_secret;
  let scope = req.body.scope;

  console.log('------------------------------------');
  console.log({
    endpoint: "/generarToken",
    timestamp: new Date(),
    grant_type: grant_type,
    client_id: client_id,
    client_secret: client_secret,
    scope: scope,
  });

  let url = baseUrl + "/oauth2Provider/type1/v1/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    agent: sslConfiguredAgent(),
    body: `grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&scope=${scope}`,
  });

  const responseData = await response.json();

  console.log(responseData);
  console.log('------------------------------------');
  res.json(responseData);
});

app.post("/intencionCompra", async (req, res) => {
  let token = req.body.token;
  let customer_key = req.body.customer_key;
  let valor = req.body.valor;
  let numeroIdentificacion = req.body.numeroIdentificacion;
  let tipoDocumento = req.body.tipoDocumento;

  console.log('------------------------------------');
  console.log({
    endpoint: "/intencionCompra",
    timestamp: new Date(),
    token: token,
    customer_key: customer_key,
    valor: valor,
    numeroIdentificacion: numeroIdentificacion,
    tipoDocumento: tipoDocumento,
  });
  valorCompra = valor;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-ibm-client-id": customer_key,
    Authorization: `Bearer ${token}`,
  };
  let data = {
    valor: 1,
    numeroIdentificacion: numeroIdentificacion,
    tipoDocumento: tipoDocumento,
  };

  let url = baseUrl + "/daviplata/v1/compra";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    agent: sslConfiguredAgent(),
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  console.log(responseData);
  console.log('------------------------------------');
  res.json(responseData);
});

app.post("/generarOTP", async (req, res) => {
  let customer_key = req.body.customer_key;
  let notification_type = req.body.notification_type;
  let numeroIdentificacion = req.body.numeroIdentificacion;
  let tipoDocumento = req.body.tipoDocumento;

  console.log('------------------------------------');
  console.log({
    endpoint: "/generarOTP",
    timestamp: new Date(),
    customer_key: customer_key,
    notification_type: notification_type,
    numeroIdentificacion: numeroIdentificacion,
    tipoDocumento: tipoDocumento,
  });

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-ibm-client-id": customer_key,
  };
  let data = {
    typeDocument: tipoDocumento,
    numberDocument: numeroIdentificacion,
    notificationType: notification_type,
  };

  let url = baseUrl + "/otpSec/v1/read";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    agent: sslConfiguredAgent(),
    body: JSON.stringify(data)
  });

  const responseData = await response.json();

  console.log(responseData);
  console.log('------------------------------------');
  res.json(responseData);
});

app.post("/autorizacionCompra", async (req, res) => {
  let token = req.body.token;
  let otp = req.body.otp;
  let idSession_Token = req.body.idSession_Token;
  let customer_key = req.body.customer_key;
  let idComercio = req.body.idComercio;
  let idTerminal = req.body.idTerminal;
  let idTransaccion = Math.floor(Math.random() * 999999) + 1;

  console.log('------------------------------------');
  console.log({
    endpoint: "/autorizacionCompra",
    timestamp: new Date(),
    token: token,
    otp: otp,
    idSession_Token: idSession_Token,
    customer_key: customer_key,
    idComercio: idComercio,
    idTerminal: idTerminal,
    idTransaccion: idTransaccion + 0,
  });

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-ibm-client-id": customer_key,
    Authorization: `Bearer ${token}`,
  };
  const data = {
    otp: otp,
    idSessionToken: idSession_Token,
    idComercio: idComercio,
    idTerminal: idTerminal,
    idTransaccion: idTransaccion,
  };
  let url = baseUrl + "/daviplata/v1/confirmarCompra";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    agent: sslConfiguredAgent(),
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  console.log(responseData);
  let resp = {
    'transaccion': {
      "idTransaccion": idTransaccion,
      "destinoPago": idComercio,
      "valorCompra": valorCompra,
      "motivo": "Compra de productos",
      "fechaTransaccion": responseData.fechaTransaccion ? responseData.fechaTransaccion : new Date(),
      "numeroAprobacion": responseData.numAprobacion ? responseData.numAprobacion : 0,
      "estado": responseData.estado ? responseData.estado : `Rechazado - ${responseData.mensajeError}`,
      "idTransaccionAutorizador": responseData.idTransaccionAutorizador ? responseData.idTransaccionAutorizador : 0,
      "codigoError": responseData.codigoError ? responseData.codigoError : 0,
      "mensajeError": responseData.mensajeError ? responseData.mensajeError : ""
    }
  }
  
  console.log(resp);
  console.log('------------------------------------');
  res.json(resp);
});

app.post("/sendSMS", async (req, res) => {
  let accountSid = req.body.accountSid;
  let authToken = req.body.authToken;
  let from = req.body.from;
  let to = req.body.to;
  let body = req.body.body;
  console.log(from, to, body);

  const client = twilio(accountSid, authToken);
  client.messages
    .create({
      body: body,
      from: from,
      to: to,
    })
    .then((data) => {
      if ("body" in data) {
        return { status: "success", message: "OK" };
      } else {
        return { status: "error", message: "Error" };
      }
    });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
