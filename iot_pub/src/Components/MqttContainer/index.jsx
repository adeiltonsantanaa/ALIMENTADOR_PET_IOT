import React, { useState } from 'react';
import MqttButton from '../MqttButton';
import './style.css';

export default function MqttContainer() {

    const [broker, setBroker] = useState('broker.hivemq.com');
    const [topic, setTopic] = useState('tpc/adl');
    const [message, setMessage] = useState('');

    return (
        <div id='mqtt-container'>
            <h1>MQTT Container</h1>

            <div id='container-conexao'>
                <label htmlFor="broker">Broker</label>
                <input disabled className='input-conexao' value={broker} type="text" id="broker" onChange={(e) => setBroker(e.target.value)} />

                <label htmlFor="topic">Tópico</label>
                <input disabled className='input-conexao' value={topic} type="text" id="topic" onChange={(e) => setTopic(e.target.value)} />
            </div>

            <MqttButton broker={broker} topic={topic} message={message} />
        </div>
    );
};