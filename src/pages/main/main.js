import React from 'react';
import { Layout, Typography } from 'antd';
import LocationForm from '../../components/locationForm/locationForm';
import 'leaflet/dist/leaflet.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function Main() {
    return (
        <Layout className="layout" style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(225deg, #004680, #4484BA)' // Gradiente de fundo
        }}>
            <Header style={{ background: 'none', marginBottom: 24 }}>
                <Title style={{
                    color: 'white',
                    textAlign: 'center', 
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)' // Sombra para melhorar a legibilidade
                }} level={1}>Bigu</Title>
            </Header>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: 600, padding: 24, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
                    <LocationForm />
                </div>
            </Content>
        </Layout>
    );
}

export default Main;
