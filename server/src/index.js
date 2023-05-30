import express from "express";
import bodyParser from "body-parser";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cookieParser());

app.set('port', process.env.PORT || 5050);
app.set('json spaces', 2);

app.set('view engine', 'ejs');
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({   
    extended: true
}));

app.use(router);

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});