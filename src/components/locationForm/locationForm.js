//imports básicos react e afins
import React, { useState } from 'react';
import { Layout, Card, Button, Input, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './locationForm.module.css';
import ShowPositionOnMap from '../showPositionOnMap/showPositionOnMap';
import ShowRoute from '../showRoute/showRoute';
import { useHaversine } from '../../hooks/useHaversine/useHaversine';
import { useLocationSearch } from '../../hooks/useLocationSearch/useLocationSearch';

const { Content } = Layout;

//determinando as coordenadas predeterminadas
const pessoas = [
    { nome: "Pessoa 1", partida: { latitude: -9.665833, longitude: -35.735278 }, chegada: { latitude: -9.655833, longitude: -35.745278 } },
    { nome: "Pessoa 2", partida: { latitude: -9.670278, longitude: -35.713056 }, chegada: { latitude: -9.660278, longitude: -35.723056 } },
    { nome: "Pessoa 3", partida: { latitude: -9.649722, longitude: -35.708056 }, chegada: { latitude: -9.639722, longitude: -35.718056 } },
    { nome: "Pessoa 4", partida: { latitude: -9.638889, longitude: -35.714722 }, chegada: { latitude: -9.628889, longitude: -35.724722 } },
    { nome: "Pessoa 5", partida: { latitude: -9.664722, longitude: -35.735556 }, chegada: { latitude: -9.654722, longitude: -35.745556 } }
];

//função que atrbui coordenadas e procura sua localização
const LocationForm = () => {
    const { searchLocation, loading } = useLocationSearch();
    const { calculateDistance } = useHaversine();
    const [pontoPartida, setPontoPartida] = useState('');
    const [pontoChegada, setPontoChegada] = useState('');
    const [resultadoPartida, setResultadoPartida] = useState(null);
    const [resultadoChegada, setResultadoChegada] = useState(null);
    const [pessoaMaisProxima, setPessoaMaisProxima] = useState(null);

    const handleSearch = async (ponto, setResultado) => {
        const resultado = await searchLocation(ponto);
        setResultado(resultado);
    };

    //função que procura a melhor opção para ser escolhida
    const encontrarPessoaMaisProxima = () => {
        if (!resultadoPartida) {
            message.error('Defina primeiro o ponto de partida!');
            return;
        }

        let minDist = Infinity;
        let closestPerson = null;
        pessoas.forEach(p => {
            const dist = calculateDistance(resultadoPartida.latitude, resultadoPartida.longitude, p.partida.latitude, p.partida.longitude);

            //se a distancia foi menor doq a distancia minima determinada ele será escolhido como possivel melhor opção
            if (dist < minDist) {
                minDist = dist;
                closestPerson = p;
            }
        });
        setPessoaMaisProxima(closestPerson);
    };

    return (
        <Layout className={styles.container}>

            <Content>

                <Card className={styles.card} title="Ponto de Partida">

                    <Input.Search
                        //botões e input da primeira coordenada (atual)
                        className={styles.searchInput}
                        value={pontoPartida}
                        onChange={e => setPontoPartida(e.target.value)}
                        onSearch={() => handleSearch(pontoPartida, setResultadoPartida)}
                        enterButton={<Button icon={<SearchOutlined />} loading={loading}>Buscar</Button>}
                        placeholder="Ponto de Partida"
                    />
                    {resultadoPartida && (
                        <ShowPositionOnMap latitude={resultadoPartida.latitude} longitude={resultadoPartida.longitude} />
                    )}

                </Card>

                <Card className={styles.card} title="Ponto de Chegada">

                    <Input.Search
                        //botões e input da segunda coordenada (chegada)
                        className={styles.searchInput}
                        value={pontoChegada}
                        onChange={e => setPontoChegada(e.target.value)}
                        onSearch={() => handleSearch(pontoChegada, setResultadoChegada)}
                        enterButton={<Button icon={<SearchOutlined />} loading={loading}>Buscar</Button>}
                        placeholder='Ponto de Chegada'
                    />
                    {resultadoChegada && (
                        <ShowPositionOnMap latitude={resultadoChegada.latitude} longitude={resultadoChegada.longitude} />
                    )}

                </Card>

                {/*botão que chama a função de matchmaking 'encontrarPessoaMaisProxima'*/}
                <Button type="primary" onClick={encontrarPessoaMaisProxima} loading={loading}>
                    Encontrar Pessoa Mais Próxima
                </Button>

                {pessoaMaisProxima && (
                    //Card contendo a localização da melhor opção
                    <Card title="Pessoa Mais Próxima">
                        <p>{pessoaMaisProxima.nome}</p>
                        <p>Distância: {calculateDistance(resultadoPartida.latitude, resultadoPartida.longitude, pessoaMaisProxima.partida.latitude, pessoaMaisProxima.partida.longitude).toFixed(2)} km</p>
                        <ShowRoute start={resultadoPartida} end={resultadoChegada} pointB={pessoaMaisProxima.partida} />
                    </Card>

                )}
            </Content>
        </Layout>
    );
};

export default LocationForm;
