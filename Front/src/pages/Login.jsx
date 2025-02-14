import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import signinImage from '../assets/piclumen-1736819980550.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Almacenar el token
                localStorage.setItem('rol', data.rol); // Almacenar el nombre del rol
                navigate('/dashboard'); // Redirigir al dashboard
            } else {
                alert(data.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div className="font-[sans-serif] max-sm:px-4">
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                    <div className="md:max-w-md w-full px-4 py-4">
                        <form onSubmit={handleLogin}>
                            <div className="mb-12">
                                <h3 className="text-gray-800 text-3xl font-extrabold">Inicio de sesión</h3>
                            </div>

                            <div>
                                <label className="text-gray-800 text-xs block mb-2">Email</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="email"
                                        type="text"
                                        required
                                        className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-login-button pl-2 pr-8 py-3 outline-none"
                                        placeholder="Ingresa el e-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                                        <defs>
                                            <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                            </clipPath>
                                        </defs>
                                        <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                            <path fill="none" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                                            <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="text-gray-800 text-xs block mb-2">Contraseña</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-login-button pl-2 pr-8 py-3 outline-none"
                                        placeholder="Ingresa la contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                                        <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                                    </svg>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                                        Recordar
                                    </label>
                                </div>
                                <div>
                                    <a href="jajvascript:void(0);" className="text-login-button font-semibold text-sm hover:underline">
                                        Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>

                            <div className="mt-12">
                                <button type="submit" className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-login-button hover:bg-login-button-hover focus:outline-none">
                                    Iniciar sesión
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="w-full h-full flex items-center rounded-xl p-8">
                        <img
                            src={signinImage}
                            className="w-full aspect-[12/12] object-contain rounded-lg shadow-xl"
                            alt="login-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;