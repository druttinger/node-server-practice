const express = requrire('express');
const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
    res.send('Hello World');
}
);

indexRouter.post('/', (req, res) => {
    const { name } = req.body;
    res.send(`Hello ${name}`);
}
);

export default indexRouter;
