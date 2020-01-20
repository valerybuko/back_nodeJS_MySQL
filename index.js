import express from 'express';
import boom from 'express-boom';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';

const app = express();
const PORT = 8000;

const sequelize = new Sequelize('slack', 'valera', 'qwe12345', {
  dialect: 'mysql',
  host: 'localhost',
  define: {
    timestamps: false
  }
});

const Users = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isConfirm: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
  }
});

sequelize.sync({ force: true })
  .then(res => console.log('Connection to the database has been successful'))
  .catch(err => console.log(err));

app.use(boom());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
app.use(router);

app.get('/', (req, res) => {
  res.send(`Node and express server running on port ${PORT}`);
});

app.listen(PORT, async(req, res) => {
  console.log(`Server has been statred on port ${PORT}`);
});

app.post('/create-user', async (req, res) => {
  const newUser = await addNewUser(req.body).catch(err => console.log(err));
  return res.send(newUser);
});

app.get('/users', async (req, res) => {
  const allUsers = await getAllUsers().catch(err => console.log(err));
  return res.send(allUsers);
});

app.get('/user', async (req, res) => {
  const user = await getUserWithID(req.query.id).catch(err => console.log(err));
  return res.send(user);
});

app.put('/user', async (req, res) => {
  const result = await updateUser(req.body).catch(err => console.log(err));
  return res.send(result);
});

app.delete('/user', async (req, res) => {
  await deleteUser(req.query.id).catch(err => console.log(err));
  return res.send();
});

const addNewUser = (user) => {
  const {username, email, password} = user;
  return Users.create({
      username,
      email,
      password,
    })
}

const getAllUsers = () => {
  return Users.findAll({raw:true})
}

const getUserWithID = (id) => {
  return Users.findByPk(id)
}

const updateUser = (user) => {
  const {id, username, email, password, isConfirm} = user;
  return Users.update({ username, email, password, isConfirm }, {
      where: {
        id
      }
    })
}

const deleteUser = (id) => {
  return Users.destroy({
      where: {
        id
      }
    })
}
