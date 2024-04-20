import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Layout, Card, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './locationForm.module.css';
import ShowPositionOnMap from '../showPositionOnMap/showPositionOnMap';
import ShowRoute from '../showRoute/showRoute';

const { Content } = Layout;

const pessoas = [
    { nome: "Pessoa 1", partida: { latitude: -9.665833, longitude: -35.735278 }, chegada: { latitude: -9.655833, longitude: -35.745278 } },
    { nome: "Pessoa 2", partida: { latitude: -9.670278, longitude: -35.713056 }, chegada: { latitude: -9.660278, longitude: -35.723056 } },
    { nome: "Pessoa 3", partida: { latitude: -9.649722, longitude: -35.708056 }, chegada: { latitude: -9.639722, longitude: -35.718056 } },
    { nome: "Pessoa 4", partida: { latitude: -9.638889, longitude: -35.714722 }, chegada: { latitude: -9.628889, longitude: -35.724722 } },
    { nome: "Pessoa 5", partida: { latitude: -9.664722, longitude: -35.735556 }, chegada: { latitude: -9.654722, longitude: -35.745556 } }
];

function LocationForm() {
    const [pontoPartida, setPontoPartida] = useState('');
    const [pontoChegada, setPontoChegada] = useState('');
    const [resultadoPartida, setResultadoPartida] = useState(null);
    const [resultadoChegada, setResultadoChegada] = useState(null);
    const [pessoaMaisProxima, setPessoaMaisProxima] = useState(null);
    const [loading, setLoading] = useState(false);

    const buscarLocalizacao = async (endereco, setResultado) => {
        setLoading(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.length > 0 && data[0].lat && data[0].lon) {
                setResultado({
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                });
                message.success('Endereço encontrado');
            } else {
                setResultado(null);
                message.error('Endereço não encontrado');
            }
        } catch (error) {
            console.error("Erro ao buscar localização:", error);
            message.error('Erro ao buscar localização');
        }
        setLoading(false);
    };

    const encontrarPessoaMaisProxima = useCallback(() => {
        let menorDistancia = Infinity;
        let pessoaProxima = null;
    
        pessoas.forEach(pessoa => {
            const distanciaPartida = calcularDistancia(resultadoPartida.latitude, resultadoPartida.longitude, pessoa.partida.latitude, pessoa.partida.longitude);
            const distanciaChegada = calcularDistancia(resultadoChegada.latitude, resultadoChegada.longitude, pessoa.chegada.latitude, pessoa.chegada.longitude);
            const distanciaTotal = distanciaPartida + distanciaChegada;
    
            if (distanciaTotal < menorDistancia) {
                menorDistancia = distanciaTotal;
                pessoaProxima = pessoa;
            }
        });
    
        setPessoaMaisProxima(pessoaProxima);
    }, [resultadoPartida, resultadoChegada]); // Dependências da função

    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
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
                        loading={loading}
                    />
                    {resultadoPartida && (
                        <ShowPositionOnMap className={styles.showMap} latitude={resultadoPartida.latitude} longitude={resultadoPartida.longitude} />
                    )}
                </Card>
                <Card className={styles.card} title="Ponto de Chegada">
                    <Input.Search
                        className={styles.searchInput}
                        value={pontoChegada}
                        onChange={e => setPontoChegada(e.target.value)}
                        onSearch={() => buscarLocalizacao(pontoChegada, setResultadoChegada)}
                        placeholder='Ponto de Chegada'
                        enterButton={<Button className={styles.button} icon={<SearchOutlined />} />}
                        loading={loading}
                    />
                    {resultadoChegada && (
                        <ShowPositionOnMap className={styles.showMap} latitude={resultadoChegada.latitude} longitude={resultadoChegada.longitude} />
                    )}
                </Card>
                {pessoaMaisProxima && (
                    <Card className={styles.card}>
                        <p>Pessoa Mais Proxima: {pessoaMaisProxima.nome}</p>
                        <p>Distância Partida: {calcularDistancia(resultadoPartida.latitude, resultadoPartida.longitude, pessoaMaisProxima.partida.latitude, pessoaMaisProxima.partida.longitude).toFixed(2)} km</p>
                        <p>Distância Chegada: {calcularDistancia(resultadoChegada.latitude, resultadoChegada.longitude, pessoaMaisProxima.chegada.latitude, pessoaMaisProxima.chegada.longitude).toFixed(2)} km</p>
                        <p>Distância Total: {(calcularDistancia(resultadoPartida.latitude, resultadoPartida.longitude, pessoaMaisProxima.partida.latitude, pessoaMaisProxima.partida.longitude) + calcularDistancia(resultadoChegada.latitude, resultadoChegada.longitude, pessoaMaisProxima.chegada.latitude, pessoaMaisProxima.chegada.longitude)).toFixed(2)} km</p>
                    </Card>
                )}
                
                {resultadoPartida && pessoaMaisProxima && resultadoChegada && (
                    <Card className={styles.card}>
                        <ShowRoute
                            pointA={resultadoPartida}
                            pointB={resultadoChegada}
                            personClosest={pessoaMaisProxima.partida}  // Ajuste conforme o necessário
                        />
                    </Card>
                )}
            </Content>
        </Layout>
    );
}

export default LocationForm;
