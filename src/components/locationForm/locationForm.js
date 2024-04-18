import React, { useState } from 'react';
import { Button, Input, Layout, Card, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './locationForm.module.css'
import ShowPositionOnMap from '../showPositionOnMap/showPositionOnMap';

const { Header, Content } = Layout;

// Dados atualizados das pessoas com pontos de partida e chegada.
const pessoas = [
    { nome: "Pessoa 1", partida: { latitude: -9.665833, longitude: -35.735278 }, chegada: { latitude: -9.655833, longitude: -35.745278 } },
    { nome: "Pessoa 2", partida: { latitude: -9.670278, longitude: -35.713056 }, chegada: { latitude: -9.660278, longitude: -35.723056 } },
    { nome: "Pessoa 3", partida: { latitude: -9.649722, longitude: -35.708056 }, chegada: { latitude: -9.639722, longitude: -35.718056 } },
    { nome: "Pessoa 4", partida: { latitude: -9.638889, longitude: -35.714722 }, chegada: { latitude: -9.628889, longitude: -35.724722 } },
    { nome: "Pessoa 5", partida: { latitude: -9.664722, longitude: -35.735556 }, chegada: { latitude: -9.654722, longitude: -35.745556 } }
];

// Componente LocationForm.
function LocationForm() {
    const [pontoPartida, setPontoPartida] = useState('');
    const [pontoChegada, setPontoChegada] = useState('');
    const [resultadoPartida, setResultadoPartida] = useState(null);
    const [resultadoChegada, setResultadoChegada] = useState(null);
    const [pessoaMaisProxima, setPessoaMaisProxima] = useState(null);

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

    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c; // Distância em km
    }

    const encontrarPessoaMaisProxima = () => {
        if (!resultadoPartida || !resultadoChegada) {
            alert('Por favor, busque os endereços de partida e chegada primeiro.');
            return;
        }

        let menorDistancia = Infinity;
        let pessoaMaisProxima = null;

        pessoas.forEach(pessoa => {
            const distanciaPartida = calcularDistancia(resultadoPartida.lat, resultadoPartida.lon, pessoa.partida.latitude, pessoa.partida.longitude);
            const distanciaChegada = calcularDistancia(resultadoChegada.lat, resultadoChegada.lon, pessoa.chegada.latitude, pessoa.chegada.longitude);
            const distanciaTotal = distanciaPartida + distanciaChegada;

            if (distanciaTotal < menorDistancia) {
                menorDistancia = distanciaTotal;
                pessoaMaisProxima = pessoa;
            }
        });

        setPessoaMaisProxima(pessoaMaisProxima);
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
                <Button className={styles.button} onClick={encontrarPessoaMaisProxima}>Encontrar Pessoa Mais Proxima</Button>
                {pessoaMaisProxima && (
                    <Card className={styles.card}>
                        <p>Pessoa Mais Proxima: {pessoaMaisProxima.nome}</p>
                        <p>Distância Partida: {calcularDistancia(resultadoPartida.lat, resultadoPartida.lon, pessoaMaisProxima.partida.latitude, pessoaMaisProxima.partida.longitude).toFixed(2)} km</p>
                        <p>Distância Chegada: {calcularDistancia(resultadoChegada.lat, resultadoChegada.lon, pessoaMaisProxima.chegada.latitude, pessoaMaisProxima.chegada.longitude).toFixed(2)} km</p>
                        <p>Distância Total: {(calcularDistancia(resultadoPartida.lat, resultadoPartida.lon, pessoaMaisProxima.partida.latitude, pessoaMaisProxima.partida.longitude) + calcularDistancia(resultadoChegada.lat, resultadoChegada.lon, pessoaMaisProxima.chegada.latitude, pessoaMaisProxima.chegada.longitude)).toFixed(2)} km</p>
                    </Card>
                )}
            </Content>
        </Layout>
    );
}

export default LocationForm;
