const express = requrire('express');
const newRouter = express.Router();

newRouter.get('/', (req, res) => {
    res.send('Hello World');
}
);

newRouter.post('/', (req, res) => {
    const { name } = req.body;
    res.send(`Hello ${name}`);
}
);

export default newRouter;
