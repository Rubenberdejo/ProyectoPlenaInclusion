import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

// Funcion que se encarga de cambiar el email de un usuario.
const CambioEmail = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: ''
    });
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [oldEmail, setOldEm] = useState('');
    const [newEmail, setNewEm] = useState('');
    const [msg, setMsg] = useState('');

    // Actualizamos el token para que no caduque.
    useEffect(() => {
        refreshToken();
    }, []);
    const CambioEmail = async (e) => {
        e.preventDefault();
        const options = {
            // Sacamos un alert para confirmar el cambio del email.
            title: 'Confirmar cambio de email',
            buttons: [
              {
                label: 'Si',
                onClick: async () => {
                    try {
                        // Parametros para cambiar el email.
                        const response = await axios.post('/CambioEmail', {
                            name: user.name,
                            oldEm: oldEmail,
                            newEm: newEmail
                            
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
                            <form onSubmit={CambioEmail} className="box">
                                <div className="field mt-5 has-text-centered">
                                    <p className="has-text-centered" style={{ fontSize: 45 }}>Cambio de email</p>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">email actual:</label>
                                    <div className="controls">
                                        <input type="email" className="input" placeholder="email@example.com" value={oldEmail} onChange={(e) => setOldEm(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Nuevo email:</label>
                                    <div className="controls">
                                        <input type="email" className="input" placeholder="email@example.com" value={newEmail} onChange={(e) => setNewEm(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Cambiar email</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CambioEmail;