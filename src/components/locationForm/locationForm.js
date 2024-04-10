import React, { useState } from 'react';
import { Button, Input } from 'antd';
import styles from './locationForm.module.css'

// Definição estática de pessoas em pontos diferentes.

const pessoas = [
    { nome: "Pessoa 1: Praia de Pajuçara", latitude: -9.665833, longitude: -35.735278 },
    { nome: "Pessoa 2: Praia de Ponta Verde", latitude: -9.670278, longitude: -35.713056 },
    { nome: "Pessoa 3: Praia de Jatiúca", latitude: -9.649722, longitude: -35.708056 },
    { nome: "Pessoa 4: Parque Municipal de Maceió", latitude: -9.638889, longitude: -35.714722 },
    { nome: "Pessoa 5: Museu Théo Brandão", latitude: -9.664722, longitude: -35.735556 }
  ];  

// Função para puxar os pontos de partida e destino do usuário

function LocationForm() {
    const [pontoPartida, setPontoPartida] = useState('');
    const [pontoChegada, setPontoChegada] = useState('');
    const [resultadoPartida, setResultadoPartida] = useState(null);
    const [resultadoChegada, setResultadoChegada] = useState(null);
    const [pontoMaisProximo, setPontoMaisProximo] = useState(null);
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

    // Algoritmo para calcular distância baseado na formula de Harversine

    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180; // Diferença em radianos
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distancia = R * c; // Distância em km
        return distancia;
      }

      // Encontra a menor distância entre pontos.

      const encontrarPontoMaisProximo = () => {
        if (!resultadoPartida) {
            alert('Por favor, busque o endereço de partida primeiro.');
            return;
        }

        let menorDistancia = Infinity;
        let pontoMaisProximo = null;

        pessoas.forEach(ponto => {
            const distancia = calcularDistancia(
                resultadoPartida.lat, resultadoPartida.lon,
                ponto.latitude, ponto.longitude
            );

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                pontoMaisProximo = ponto;
            }
        });

        setPontoMaisProximo(pontoMaisProximo);
    };

    return (
        <div className={styles.body}>
            {/*UI para Ponto de partida e destino*/}
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

            <div>
                <Button onClick={encontrarPontoMaisProximo}>Encontrar Pessoa Mais Próxima</Button>
                {pontoMaisProximo && (
                    <div>
                        <p>Pessoa Mais Próxima: {pontoMaisProximo.nome}</p>
                        <p>Distância: {calcularDistancia(resultadoPartida.lat, resultadoPartida.lon, pontoMaisProximo.latitude, pontoMaisProximo.longitude).toFixed(2)} km</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LocationForm;
