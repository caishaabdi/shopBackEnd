const express = require('express')
const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const productRouter = require('./routers/product_router')
const authRoute = require('./routers/AuthRoute')
const userRouter = require('./routers/userRouter')
const OrderRouter = require('./routers/OrderRouter')
const CartRouter = require('./routers/CartRouter')
dotenv.config()
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Db Connected")).catch((err) => console.log(err))
app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/', authRoute)  //login & register
app.use('/api/products', productRouter)
app.use('/api/users/', userRouter)
app.use('/api/orders/', OrderRouter)
app.use('/api/cart/', CartRouter)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))


