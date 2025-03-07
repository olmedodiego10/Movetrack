import FormularioLogin from './assets/components/Login';
import FormularioRegistro from './assets/components/RegistroUsuario'
//import Menu from './assets/components/Menu'
import Dashboard from './assets/components/Dashboard'
import './bootstrap.min.css';
import './estilos.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ToastContainer } from 'react-toastify';
import "react-toastify/ReactToastify.css"


const App = () => {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<FormularioLogin />} />
            <Route path="/registro" element={<FormularioRegistro />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
    </Provider>
  )
}

export default App
