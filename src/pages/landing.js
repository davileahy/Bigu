import React from 'react';
import { Layout, Typography } from 'antd';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

function Landing() {
    const navigate = useNavigate();

    const navigateToMain = () => {
      navigate('/Main');
    };
  
    return (
        <Layout className="flex min-h-screen flex-col bg-gradient-to-br from-blue-800 to-blue-300">
            <div className="bg-transparent flex flex-col items-center mt-8">
                <img src="/images/bigulogo.png" alt="logo" className="self-center max-w-full max-h-screen"/>
                <h2 className="text-white text-xl mt-0">ECONOMIZE, CONECTE-SE, COLABORE</h2>
            </div>
    
            <Content className="flex justify-center items-center flex-grow mt-4">
                <div className="w-full max-w-md p-6 bg-white bg-opacity-80 rounded-lg">
                    <button 
                        className="w-full text-center text-base font-semibold"
                        style={{ fontSize: '15px' }}
                        onClick={navigateToMain}>
                        Pegue um Bigu!
                    </button>
                </div>
            </Content>
        </Layout>
    );
    
    
}

export default Landing;