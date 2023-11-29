import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, FormSelect, Button } from 'react-bootstrap';
import MqttPublicador from '../MqttPublicador';
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

export default function MqttContainer() {
    const [broker, setBroker] = useState('broker.hivemq.com');
    const [topico, setTopico] = useState('tpc/adl');
    const [mensagem, setMensagem] = useState('');

    const handleSetBroker = (e) => {
        setBroker(e.target.value);
    };

    const handleSetTopico = (e) => {
        setTopico(e.target.value);
    };

    const handleSetMensagem = (e) => {
        setMensagem(e.target.value);
    };

    return (
        <Container className="text-center" style={{ minHeight: '100vh' }}>
            <ToastContainer />
            <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Col md={6}>
                    <div>
                        <h1>Publicador MQTT</h1>
                        <Form>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="brokerLb">
                                    Broker
                                </InputGroup.Text>
                                <Form.Control
                                    id="broker"
                                    value={broker}
                                    onChange={handleSetBroker}
                                    disabled
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="topicoLb">
                                    Tópico
                                </InputGroup.Text>
                                <Form.Control
                                    id="topico"
                                    value={topico}
                                    onChange={handleSetTopico}
                                    disabled
                                />
                            </InputGroup>
                            <FormSelect aria-label="Default select example" onChange={handleSetMensagem} style={{ border: '1px solid #ced4da', borderRadius: '0.25rem', padding: '0.375rem 0.75rem', width: '100%' }}>
                                <option value="">Selecione uma Ação</option>
                                <option value="120">Abrir Compartimento</option>
                                <option value="5">Fechar</option>
                            </FormSelect>
                        </Form>
                        <MqttPublicador broker={broker} topico={topico} mensagem={mensagem} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}