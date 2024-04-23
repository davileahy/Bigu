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

    { nome: "Victor", partida: { latitude: -9.65962113904759, longitude: -35.70531047541993 }, chegada: { latitude: -9.633566323869907, longitude: -35.70367813599484 }, localpartida: 'Avenida Professor Vital Barbosa', localchegada: 'Centro Universitário de Maceió' },

    { nome: "Davi", partida: { latitude: -9.648579319751494, longitude: -35.71563004185323 }, chegada: { latitude: -9.661136137013715, longitude: -35.69728034897884 }, localpartida: 'Maceio Shopping', localchegada: 'Maceio Mar Hotel' },
     
    { nome: "Filipe", partida: { latitude: -9.651828436798906, longitude: -35.73339479802717 }, chegada: { latitude: -9.65156469032868, longitude:-35.70695752702342 }, localpartida: 'Praça Do Centenário', localchegada: 'The Square Office' },
     
    { nome: "Julio", partida: { latitude: -9.512648592636323, longitude: -35.79724039245005}, chegada: { latitude: -9.617692640300307, longitude: -35.6897613196884}, localpartida: 'Aeroporto Internacional Zumbi dos Palmares', localchegada: 'Jacarecica do sul'}

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

                <div className={styles.finalmsg}>

                {pessoaMaisProxima && (

                    //Card contendo a localização da melhor opção
                    <Card title="Pessoa Mais Próxima">

                        <p>{pessoaMaisProxima.nome} está saindo de: {pessoaMaisProxima.localpartida}</p>
                        <p> Com destino à: {pessoaMaisProxima.localchegada}</p>

                        <h1>Distância entre você e o motorista: {calculateDistance(resultadoPartida.latitude, resultadoPartida.longitude, pessoaMaisProxima.partida.latitude, pessoaMaisProxima.partida.longitude).toFixed(2)} km</h1>

                        <ShowRoute start={resultadoPartida} end={resultadoChegada} pointB={pessoaMaisProxima.partida} />
                    </Card>
                )}

                </div>

            </Content>
        </Layout>
    );
};

export default LocationForm;
