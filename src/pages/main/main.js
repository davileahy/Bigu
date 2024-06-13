import React from 'react';
import { Layout, Typography } from 'antd';
import LocationForm from '../../components/locationForm/locationForm';
import 'leaflet/dist/leaflet.css';
import 'tailwindcss/tailwind.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function Main() {
    return (
        <Layout className="flex min-h-screen flex-col bg-gradient-to-br from-blue-800 to-blue-300">
            <div className="bg-transparent m-3 flex justify-center mb-2">
                <img src="/images/bigulogo.png" alt="logo" className="self-center max-w-full max-h-screen"/>
            </div>
    
            <Content className="flex justify-center items-center flex-grow mt-2">
                <div className="w-full max-w-md p-6 bg-white bg-opacity-80 rounded-lg">
                    <LocationForm />
                </div>
            </Content>
        </Layout>
    );
    
}

export default Main;
