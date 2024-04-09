import React, { useState } from 'react';
import { Button, Input } from 'antd';
import styles from './locationForm.module.css'

function LocationForm() {
    const [pontoPartida, setPontoPartida] = useState('');
    const [pontoChegada, setPontoChegada] = useState('');
    const [resultadoPartida, setResultadoPartida] = useState(null);
    const [resultadoChegada, setResultadoChegada] = useState(null);
    const [rota, setRota] = useState(null);

    const API_KEY = process.env.NOMINATIM_API_KEY;

    const buscarLocalizacao = async (endereco, setResultado) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();
            if (dados.length > 0) {
                setResultado(dados[0]);
            } else {
                setResultado(null);
                alert('Endereço não encontrado');
            }
        } catch (erro) {
            console.error("Erro ao buscar localização:", erro);
            alert('Erro ao buscar localização');
        }
    };

    const calcularRota = async () => {
        if (!resultadoPartida || !resultadoChegada) {
            alert('Por favor, busque os dois endereços primeiro.');
            return;
        }

        const body = {
            coordinates: [
                [parseFloat(resultadoPartida.lon), parseFloat(resultadoPartida.lat)],
                [parseFloat(resultadoChegada.lon), parseFloat(resultadoChegada.lat)]
            ]
        };

        const options = {
            method: 'POST',
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        try {
            const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', options);
            const data = await response.json();
            setRota(data);
        } catch (error) {
            console.error('Erro ao calcular a rota:', error);
            alert('Erro ao calcular a rota');
        }
    };

    return (
        <div className={styles.body}>
            <div>
                <Input 
                    type="text"
                    value={pontoPartida}
                    onChange={e => setPontoPartida(e.target.value)}
                    placeholder="Ponto de Partida"
                />
                <br></br> 
                <Button onClick={() => buscarLocalizacao(pontoPartida, setResultadoPartida)}>Buscar Partida</Button>
                {resultadoPartida && (
                    <div>
                        <p>Partida - Latitude: {resultadoPartida.lat}</p>
                        <p>Partida - Longitude: {resultadoPartida.lon}</p>
                    </div>
                )}
                
            </div>
            <br></br>
            <div>
                <Input
                    type="text"
                    value={pontoChegada}
                    onChange={e => setPontoChegada(e.target.value)}
                    placeholder="Ponto de Chegada"
                />
                <br></br>
                <Button onClick={() => buscarLocalizacao(pontoChegada, setResultadoChegada)}>Buscar Chegada</Button>
                {resultadoChegada && (
                    <div>
                        <p>Chegada - Latitude: {resultadoChegada.lat}</p>
                        <p>Chegada - Longitude: {resultadoChegada.lon}</p>
                    </div>
                )}
            </div>
            <Button onClick={calcularRota}>Calcular Rota</Button>
            {rota && (
                <div>
                    <p>Distância: {rota.features[0].properties.summary.distance} metros</p>
                    <p>Tempo estimado: {Math.round(rota.features[0].properties.summary.duration / 60)} minutos</p>
                </div>
            )}
        </div>
    );
}

export default LocationForm;
