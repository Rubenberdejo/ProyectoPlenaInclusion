
import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import moment from 'moment';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// Pantalla que aloja las funciones que podemos ejecutar en la aplicacion.
const Dashboard = () => {
    const [user, setUser] = useState({
        userId: -1,
        name: '',
        email: ''
    });
    const [enableEmails, setEnableEmails] = useState(user.enableEmails);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [activitiesByUserDate, setActivitiesByUserDate] = useState([]);
    const [notactivitiesByUserDate, setNotActivitiesByUserDate] = useState([]);
    
    // Variables de tiempo que se usan para elegir correctamente los rangos de tiempo de las actividades.
    var curr = new Date();
    var date = curr.toISOString().substring(0, 10);
    curr.setDate(curr.getDate() + 7);
    const [startDate, setStartDate] = useState(date);
    const [startDate2, setStartDate2] = useState(date);
    date = curr.toISOString().substring(0, 10);
    const [endDate, setEndDate] = useState(date);
    const [endDate2, setEndDate2] = useState(date);


    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        defaultDate();
        getActivitiesByUserDate(new Event('firstTime'));
        getNotActivitiesByUserDate(new Event('firstTime'));
    }, []);

    useEffect(() => {
        if (user.userId !== -1) {
            getActivitiesByUserDate(new Event('firstTime'));
            getNotActivitiesByUserDate(new Event('firstTime'));
        }
        setEnableEmails(user.enableEmails);
    }, [user]);

    // Fechas predeterminadas (actual + 7 dias).
    const defaultDate = async () => {
        var curr = new Date();
        var startDate = curr.toISOString().substring(0, 10);
        curr.setDate(curr.getDate() + 7);
        var endDate = curr.toISOString().substring(0, 10);
        setStartDate(startDate); setEndDate(endDate);
    }

    // Obtenemos las actividades en las que esta inscrito el usuario dando dos fechas determinadas.
    const getActivitiesByUserDate = async (e) => {
        e.preventDefault();
        const response = await axios.post('/buscarActividades',
            {

                startDate: startDate,
                endDate: endDate,
                idUser: user.userId


            }
        );
        setActivitiesByUserDate(response.data.activity);
    }

    // Obtenemos las actividades en las que no esta inscrito el usuario dando dos fechas determinadas.
    const getNotActivitiesByUserDate = async (e) => {
        e.preventDefault();
        const response = await axios.post('/buscarActividadesNoSub',
            {

                startDate: startDate2,
                endDate: endDate2,
                idUser: user.userId


            }
        );
        setNotActivitiesByUserDate(response.data.activity);
    }

    // apunta y desapunta al usuario logeado de las actividades
    const toggleActivitySignUp = async (activityId) => {
        try {
            const res = await axios.post('/toggle-participant-activity', {
                participantId: user.userId,
                activityId: activityId,
            });

            const data = res.data;
            alert(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    // Aloja la funcion para cambiar la contraseña.
    const cambiarContrasena = async (e) => {
        e.preventDefault(e);
        navigate("/CambioContra")
    }

    // Aloja la funcion para cambiar el email.
    const cambiarEmail = async (e) => {
        e.preventDefault(e);
        navigate("/CambioEmail")
    }

    //hace el logout
    const handleLogout = async () => {
        try {
            const res = await fetch('/logout', {
                method: 'POST',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.msg) {
                // Redirige al usuario a la página de inicio de sesión
                window.location.href = "/login";
            }
        } catch (error) {
            console.error(error);
        }
    }

    //cambia el recibir emails del usuario a true o false
    const handleEmailPreferenceChange = async () => {
        try {
            const res = await fetch('/updateEmailPreference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: user.userId,
                    enableEmails: !enableEmails
                })
            });
            const data = await res.json();
            if (data.msg) {
                setEnableEmails(!enableEmails);
            }
        } catch (error) {
            console.error(error);
        }
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

        <div className="container mt-5 top" style={{ paddingTop: "4%" }}>
            <div className="container mt-5 top d-flex justify-content-between">
                <div className='p-5 text-left'>
                    <p className="title is-40">Hola {user.name}</p>
                    <p className="subtitle is-60">{user.email}</p>
                    <div>
                        <button className={enableEmails ? "btn btn-success" : "btn btn-danger"} onClick={handleEmailPreferenceChange}>
                            {enableEmails ? "Emails habilitados" : "Emails deshabilitados"}
                        </button>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger">Cerrar Sesion</button>
                </div>
                <div className='p-5 text-rigth'>
                    <Form className="d-flex" onSubmit={cambiarContrasena}>
                        <Button variant="outline-success" type="submit">Cambiar contraseña</Button>
                    </Form>
                    <br></br>

                    <Form className="d-flex" onSubmit={cambiarEmail}>
                        <Button variant="outline-success" type="submit">Cambiar email</Button>
                    </Form>
                </div>
            </div>

            <div className='p-5 text-center'>
                <h1 className='mb-3' style={{ fontSize: 30, fontWeight: 'bold' }}>Actividades Apuntadas</h1>
            </div>
            <Navbar className="border-bottom border-gray pb-5">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >

                        </Nav>
                        <Form className="d-flex" onSubmit={getActivitiesByUserDate}>
                            <Form.Control className="me-2" type="date" placeholder="Date"
                                value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <Form.Control className="me-2" type="date" placeholder="Date"
                                value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            <Button variant="outline-success" type="submit">Buscar</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {{ activitiesByUserDate }.length == 0 &&
                <h2 className="noActivity">
                    No tienes ninguna actividad en las fechas seleccionadas.
                </h2>
            }

            <Row xs={1} md={4} className="g-4 mt-1 mb-5">
                {activitiesByUserDate.map((item) => (
                    <Col key={item.id}>
                        <Card className={`box-shadow`}>
                            <Card.Body>
                                <Card.Title><span style={{ fontWeight: 'bold' }}>Nombre:</span> {item.name}</Card.Title>
                                <Card.Title><span style={{ fontWeight: 'bold' }}>Fecha:</span> {moment.utc(item.date).format('YYYY-MM-DD HH:mm:ss')}</Card.Title>
                                <Card.Title><span style={{ fontWeight: 'bold' }}>Descripcion:</span> {item.description}</Card.Title>
                                <Button variant={"outline-danger"} onClick={() => toggleActivitySignUp(item.id)}>
                                    {"Cancelar inscripción"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className='p-5 text-center'>
                <h1 className='mb-3' style={{ fontSize: 30, fontWeight: 'bold' }}>Explorar Actividades</h1>
            </div>

            <Navbar className="border-bottom border-gray pb-5">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >

                        </Nav>
                        <Form className="d-flex" onSubmit={getNotActivitiesByUserDate}>
                            <Form.Control className="me-2" type="date" placeholder="Date"
                                value={startDate2} onChange={(e) => setStartDate2(e.target.value)} />
                            <Form.Control className="me-2" type="date" placeholder="Date"
                                value={endDate2} onChange={(e) => setEndDate2(e.target.value)} />
                            <Button variant="outline-success" type="submit">Buscar</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Row xs={1} md={4} className="g-4 mt-1 mb-5">
                {notactivitiesByUserDate.map((item) => (
                    <Col key={item.id}>
                        <Card className={`box-shadow`}>
                            <Card.Body>
                                <Card.Title><span style={{ fontWeight: 'bold' }}>Nombre:</span> {item.name}</Card.Title>
                                <Card.Title><span style={{ fontWeight: 'bold' }}>Fecha:</span> {moment.utc(item.date).format('YYYY-MM-DD HH:mm:ss')}</Card.Title>
                                <Card.Title><span style={{ fontWeight: 'bold' }}>Descripcion:</span> {item.description}</Card.Title>
                                <Button variant={"outline-success"} onClick={() => toggleActivitySignUp(item.id)}>
                                    {"Inscribirse en la actividad"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

        </div>
    )
}

export default Dashboard