import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Credenciales genéricas para pruebas
    const mail_admin = 'admin@test.com';
    const contraseña_admin = '1234';

    if (email === mail_admin && password === contraseña_admin) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/'); // Redirige al dashboard
    } else {
      // Muestra un mensaje de error
      alert('Credenciales incorrectas');
    }
  };

  return (
    <>
      <div className="font-[sans-serif] max-sm:px-4">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
            <div className="md:max-w-md w-full px-4 py-4">
              <form onSubmit={handleSubmit}>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none" 
                      placeholder="Ingresa el e-mail" 
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                      {/* SVG content */}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none" 
                      placeholder="Ingresa la contraseña" 
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                      {/* SVG content */}
                    </svg>
                  </div>
                </div>
    
                {/* Resto del formulario */}
    
                <div className="mt-12">
                  <button 
                    type="submit" 
                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Iniciar sesión
                  </button>
                </div>
              </form>
            </div>
    
            <div className="w-full h-full flex items-center bg-[#000842] rounded-xl p-8">
              <img src="https://readymadeui.com/signin-image.webp" className="w-full aspect-[12/12] object-contain" alt="login-image" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;