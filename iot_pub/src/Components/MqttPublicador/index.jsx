import React, { useState, useEffect, useRef } from 'react';
import { Client, Message } from 'paho-mqtt';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './style.css';

export default function MqttPublicador(props) {
  const [mqttClient, setMqttClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [statusPorta, setStatusPorta] = useState('');
  const [clientId] = useState('web-client-' + Math.random().toString(16).substr(2, 8));
  const respostaPromessaRef = useRef(null);
  const { broker, topico, mensagem } = props;

  useEffect(() => {
    if (!mqttClient || !mqttClient.isConnected()) {
      const client = new Client(broker, Number(8000), clientId);

      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;

      setMqttClient(client);
    }
  }, []);

  function onConnectionFailure(error) {
    toast.error("Falha na conexão!");
    setConnectionStatus('Falha na conexão');
  }

  function onConnectionLost(responseObject) {
  }

  function onMessageArrived(message) {
    const mensagemRecebida = message.payloadString;
    setStatusPorta(mensagemRecebida);
    if (respostaPromessaRef.current) {
      respostaPromessaRef.current.resolve();
    }
  }

  function publicarMensagem() {
    if (mensagem === '') {
      toast.error("Selecione uma ação!");
      return;
    }

    respostaPromessaRef.current = {};
    respostaPromessaRef.current.promise = new Promise((resolve, reject) => {
      respostaPromessaRef.current.resolve = resolve;
      respostaPromessaRef.current.reject = reject;
    });

    toast.promise(
      respostaPromessaRef.current.promise,
      {
        pending: 'Enviando Mensagem...',
        success: 'Mensagem Enviada!',
        error: 'Falhar ao enviar mensagem!'
      }
    );

    if (!mqttClient.isConnected()) {
      mqttClient.connect({ onSuccess: onConnect, onFailure: onConnectionFailure });
    } else {
      onConnect();
    }
  }

  function onConnect() {
    setConnectionStatus('Conectado');
    const messageObject = new Message(String(mensagem));
    messageObject.destinationName = topico;
    mqttClient.send(messageObject);
    mqttClient.subscribe("tpc/ade");
  }

  function desconectar() {
    if (mqttClient.isConnected()) {
      mqttClient.disconnect();
    }
    toast.info("Desconectado com sucesso!");
    setConnectionStatus('Desconectado');
  }

  return (
    <div>
      <p>Status da Conexão: {connectionStatus}</p>
      {statusPorta !== '' && <p>Compartimento Aberto: {statusPorta}</p>}
      <Container>
        <Row>
          <Col>
            <Button variant="primary" size='lg' className='btn-msg' onClick={() => publicarMensagem()}>Executar Ação</Button>
          </Col>
        </Row>
        <Row className='mt-1'>
          <Col>
            <Button variant="danger" size='lg' className='btn-msg' onClick={() => desconectar()}>Fechar Conexão</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}