import React, { useState, useEffect } from 'react';
import { Client, Message } from 'paho-mqtt';
import './style.css';

export default function MqttButton(props) {
  const [mqttClient, setMqttClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [clientId] = useState('web-client-' + Math.random().toString(16).substr(2, 8));
  const [broker] = useState('broker.hivemq.com');
  const [topic] = useState('tpc/adl');
  const [statusPorta, setStatusPorta] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!mqttClient || !mqttClient.isConnected()) {
      const client = new Client(broker, Number(8000), clientId);

      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;

      setMqttClient(client);
    }
  }, []);

  function onConnectionFailure(error) {
    console.log("Falha na conexão: " + error.errorMessage);
    setConnectionStatus('Falha na conexão');
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("Conexão perdida: " + responseObject.errorMessage);
      setConnectionStatus('Conexão perdida');
    }
  }

  function onMessageArrived(message) {
    const mensagemRecebida = message.payloadString;
    console.log("Mensagem recebida: " + mensagemRecebida);

    setStatusPorta(mensagemRecebida);
  }

  function publicarMensagem(value) {
    setMessage(value);
    if (!mqttClient.isConnected()) {
      mqttClient.connect({
        onSuccess: onConnect,
        onFailure: onConnectionFailure
      });
    } else {
      onConnect();
    }
  }

  function onConnect() {
    setConnectionStatus('Conectado');

    const messageObject = new Message(String(message));
    messageObject.destinationName = topic;

    console.log("Publicando mensagem: " + messageObject.payloadString);

    mqttClient.send(messageObject);
    mqttClient.subscribe("tpc/ade");
    setConnectionStatus('Mensagem publicada');
  }

  function desconectar() {
    if (mqttClient.isConnected()) {
      mqttClient.disconnect();
    }
    setConnectionStatus('Desconectado');
  }

  return (
    <div>
      <p>Status: {connectionStatus}</p>
      <p>Status da Porta: {statusPorta}</p>
      <div id='div-btn'>
        <button id='btn-msg' onClick={() => publicarMensagem("90")}>Comp. 1</button>
        <button id='btn-msg' onClick={() => publicarMensagem("180")}>Comp. 2</button>
        <button id='btn-msg' onClick={() => publicarMensagem("270")}>Comp. 3</button>
      </div>
      <div>
        <button id='btn-msg' onClick={() => publicarMensagem("0")}>Fechar</button>
      </div>
    </div>
  );
}