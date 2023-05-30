import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

// Funcion que ejecuta el cambio de contraseña.
const CambioContra = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: ''
    });
    // Variables que usamos.
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [oldPassword, setOldPw] = useState('');
    const [newPassword, setNewPw] = useState('');
    const [msg, setMsg] = useState('');

    // Actualiza el token para que no caduque.
    useEffect(() => {
        refreshToken();
    }, []);
    const CambioContra = async (e) => {
        e.preventDefault();
        // Aqui sacamos por pantalla para confirmar el cambio de contraseña.
        const options = {
            title: 'Confirmar cambio de contraseña',
            buttons: [
              {
                label: 'Si',
                onClick: async () => {
                    try {
                        const response = await axios.post('/CambioContra', {
                            // Aqui introducimos los parametros para cambiar la contraseña.
                            name: user.name,
                            oldPw: oldPassword,
                            newPw: newPassword
                            
                        },{
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setMsg(response.data.msg);
                        navigate("/Dashboard");
                    } catch (error) {
                        if (error.response) {
                            setMsg(error.response.data.msg);
                        }
                    }
                }
              },
              {
                label: 'No',
                onClick: () => alert('Click No')
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            keyCodeForClose: [8, 32],
            willUnmount: () => {},
            afterClose: () => {},
            onClickOutside: () => {},
            onKeypress: () => {},
            onKeypressEscape: () => {},
            overlayClassName: "overlay-custom-class-name"
          };
          
          confirmAlert(options);
        

    }

    const refreshToken = async () => {
        try {
            const response = await axios.get('/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUser({
                ...user, // Copy other fields
                userId: decoded.userId,
                name: decoded.name,
                email: decoded.email
            });
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }

    const axiosJWT = axios.create();

    // Siempre que se realice una peticion segura se ejcuta esta
    // funcion que actualiza el accessToken si es necesario
    // y en config añade los headers y los datos para las queries
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime() || expire == undefined) {
            const response = await axios.get('/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUser({
                ...user, // Copy other fields
                userId: decoded.userId,
                name: decoded.name,
                email: decoded.email
            });
            config.params = {
                userId: decoded.userId
            }
            setExpire(decoded.exp);
        } else {
            config.headers.Authorization = `Bearer ${token}`;
            config.params = {
                userId: user.userId
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={CambioContra} className="box">
                                <div className="field mt-5 has-text-centered">
                                    <p className="has-text-centered" style={{ fontSize: 45 }}>Cambio de contraseña</p>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Contraseña actual:</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={oldPassword} onChange={(e) => setOldPw(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Nueva contraseña:</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={newPassword} onChange={(e) => setNewPw(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Cambiar contraseña</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CambioContra;