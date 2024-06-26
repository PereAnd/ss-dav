import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import https from "https";
import cors from "cors";
import twilio from "twilio";

const app = express();
const port = 3002;

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
      "-----END CERTIFICATE-----",
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

// #region Token
app.post("/auth/token", async (req, res) => {
  let { client_id, client_secret, grant_type, scope } = req.body;
  consolelog(req.body, req.originalUrl, "INPUT");
  try {
    let url = baseUrl + "/oauth2Provider/type1/v1/token";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };
    const options = {
      method: "POST",
      headers: headers,
      agent: sslConfiguredAgent(),
      body: `grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&scope=${scope}`,
    };
    consolelog(
      { options: options, headers: headers, body: req.body },
      req.originalUrl,
      "INPUT-REQUEST"
    );
    const response = await fetch(url, options);
    const responseData = await response.json();

    consolelog(responseData, req.originalUrl, "OUTPUT");
    res.json(responseData);
  } catch (e) {
    res.status(500).send(e);
  }
});

// #region /transfer-intention
app.post("/transfer-intention", async (req, res) => {
  let { authorization, customer_key } = req.headers;
  let { valor, numeroIdentificacion, tipoDocumento } = req.body;
  let token = authorization;
  consolelog(
    { headers: req.headers, body: req.body },
    req.originalUrl,
    "INPUT"
  );
  try {
    let url = baseUrl + "/daviplata/v1/compra";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-ibm-client-id": customer_key,
      Authorization: `Bearer ${token}`,
    };
    let body = {
      valor: "1",
      numeroIdentificacion: numeroIdentificacion,
      tipoDocumento: tipoDocumento,
    };
    const options = {
      method: "POST",
      headers: headers,
      agent: sslConfiguredAgent(),
      body: JSON.stringify(body),
    };
    consolelog({ options, headers, body }, req.originalUrl, "INPUT-REQUEST");
    const response = await fetch(url, options);
    const responseData = await response.json();
    consolelog(responseData, req.originalUrl, "OUTPUT");
    res.json(responseData);
  } catch (e) {
    res.status(500).send(e);
  }
});

// #region /generate-otp
app.post("/generate-otp", async (req, res) => {
  let { customer_key } = req.headers;
  let { notificationType, numberDocument, typeDocument } = req.body;
  consolelog(
    { headers: req.headers, body: req.body },
    req.originalUrl,
    "INPUT"
  );

  try {
    let url = baseUrl + "/otpSec/v1/read";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-ibm-client-id": customer_key,
    };
    let body = {
      typeDocument,
      numberDocument,
      notificationType,
    };
    const options = {
      method: "POST",
      headers: headers,
      agent: sslConfiguredAgent(),
      body: JSON.stringify(body),
    };
    consolelog({ options, headers, body }, req.originalUrl, "INPUT-REQUEST");
    const response = await fetch(url, options);
    const responseData = await response.json();
    consolelog(responseData, req.originalUrl, "OUTPUT");
    res.json(responseData);
  } catch (e) {
    res.status(500).send(e);
  }
});

// #region /transfer-confirm
app.post("/transfer-confirm", async (req, res) => {
  let { authorization, customer_key } = req.headers;
  let { otp, idSession_Token, idComercio, idTerminal } = req.body;
  let token = authorization;
  let idTransaccion = Math.round(Math.random() * 999999);
  consolelog(
    { headers: req.headers, body: req.body },
    req.originalUrl,
    "INPUT"
  );

  try {
    let url = baseUrl + "/daviplata/v1/confirmarCompra";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-ibm-client-id": customer_key,
      Authorization: `Bearer ${token}`,
    };
    const body = {
      otp: otp,
      idSessionToken: idSession_Token,
      idComercio: idComercio,
      idTerminal: idTerminal,
      idTransaccion: idTransaccion,
    };
    const options = {
      method: "POST",
      headers: headers,
      agent: sslConfiguredAgent(),
      body: JSON.stringify(body),
    };
    consolelog({ options, headers, body }, req.originalUrl, "INPUT-REQUEST");
    const response = await fetch(url, options);
    let responseData = await response.json();
    let ip = req.ip || req.socket.remoteAddress;
    if (ip.startsWith("::ffff:")) ip = ip.slice(7);
    responseData = { ...responseData, ip };
    consolelog(responseData, req.originalUrl, "OUTPUT");
    res.json(responseData);
  } catch (e) {
    res.status(500).send(e);
  }
});

// #region Consolelog
function consolelog(data, endpoint, type) {
  console.log("_________________________" + type + "_________________________");
  console.log({ ...data, endpoint, timestamp: new Date() });
  console.log("______________________________________________________________");
}

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
