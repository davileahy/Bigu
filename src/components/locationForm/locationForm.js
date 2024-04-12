import React, { useState } from 'react';
import { Button, Input, Layout, Card, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './locationForm.module.css'
import ShowPositionOnMap from '../showPositionOnMap/showPositionOnMap';

const { Header, Content } = Layout;

// Definição estática de pessoas em pontos diferentes.

const pessoas = [
    { nome: "Pessoa 1: Praia de Pajuçara", latitude: -9.665833, longitude: -35.735278 },
    { nome: "Pessoa 2: Praia de Ponta Verde", latitude: -9.670278, longitude: -35.713056 },
    { nome: "Pessoa 3: Praia de Jatiúca", latitude: -9.649722, longitude: -35.708056 },
    { nome: "Pessoa 4: Parque Municipal de Maceió", latitude: -9.638889, longitude: -35.714722 },
    { nome: "Pessoa 5: Museu Théo Brandão", latitude: -9.664722, longitude: -35.735556 }
  ];  

// Função para puxar os pontos de partida e destino do usuário

const { Search } = Input;

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
        <Layout className={styles.container}>
        <Content>
            <Card className={styles.card} title="Ponto de Partida">
                <Input.Search
                    className={styles.searchInput}
                    value={pontoPartida}
                    onChange={e => setPontoPartida(e.target.value)}
                    onSearch={() => buscarLocalizacao(pontoPartida, setResultadoPartida)}
                    enterButton={<Button className={styles.button} icon={<SearchOutlined />} />}
                    placeholder="Ponto de Partida"
                />
                {resultadoPartida && (
                    <ShowPositionOnMap className={styles.showMap} latitude={resultadoPartida.lat} longitude={resultadoPartida.lon} />
                )}
            </Card>
            <Card className={styles.card} title="Ponto de Chegada">
                <Input.Search
                    className={styles.searchInput}
                    value={pontoChegada}
                    onChange={e => setPontoChegada(e.target.value)}
                    onSearch={() => buscarLocalizacao(pontoChegada, setResultadoChegada)}
                    enterButton="Buscar Chegada"
                />
            </Card>
            <Button className={styles.button} onClick={encontrarPontoMaisProximo}>Encontrar Pessoa Mais Próxima</Button>
            {pontoMaisProximo && (
                <Card className={styles.card}>
                    <p>Pessoa Mais Próxima: {pontoMaisProximo.nome}</p>
                    <p>Distância: {calcularDistancia(resultadoPartida.lat, resultadoPartida.lon, pontoMaisProximo.latitude, pontoMaisProximo.longitude).toFixed(2)} km</p>
                </Card>
            )}
        </Content>
    </Layout>
    );
}

export default LocationForm;
