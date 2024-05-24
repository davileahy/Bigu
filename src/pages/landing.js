import React from 'react';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    const navigateToMain = () => {
        navigate('/Main');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-800 to-blue-300">
            <header className="flex justify-center items-center py-8">
                <img src="/images/bigulogo.png" alt="logo" className="h-48"/>
            </header>
            <main className="flex flex-grow flex-col items-center justify-center px-4">
                <div className="bg-white bg-opacity-90 p-10 rounded-lg shadow-xl max-w-3xl text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Bem-vindo ao Bigu!</h1>
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                        O Bigu é uma plataforma online destinada a facilitar o compartilhamento de caronas. Nosso objetivo é reduzir custos de deslocamento e diminuir a necessidade de estacionamento. Identificamos e sugerimos as melhores combinações de caronas com base nas rotas dos usuários.
                    </p>
                    <button 
                        className="bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-md transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={navigateToMain}>
                        Pegue um Bigu!
                    </button>
                </div>
                <h2 className="text-white text-2xl mt-12 font-semibold">ECONOMIZE, CONECTE-SE, COLABORE</h2>
            </main>
            <footer className="py-4 text-center">
                <p className="text-white text-sm">© 2024 Bigu. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default Landing;
