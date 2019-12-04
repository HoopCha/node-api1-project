const express = require("express");
const db = require("./data/db.js");

const server = express();

server.use(express.json()); //middleware?

server.get('/', (req, res) => {
    res.send({ api: "up and running..." });
})

server.post('/api/users', ( req, res) => {
    const newUser =req.body;
    if (!Object.keys(newUser).includes("name") || !Object.keys(newUser).includes("bio")){
        return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    db.insert(newUser)
    .then(user => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      console.log('error', err);
      res.status(500).json({ error: 'There was an error while saving the user to the database' });
    });
});


server.get('/api/users', (req, res) => {
    db.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => {
        console.log('error', err);
        res.status(500).json({ error: "The users information could not be retrieved." });
      });
  });

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
   
    db.findById(id)
      .then(user => {
          if (user) {
        res.status(200).json(user);
          } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
          }
      })
      .catch(err => {
        console.log('error', err);
        res.status(500).json({ error: 'The user information could not be retrieved.' });
      });
    });

    server.delete('/api/users/:id', (req, res) => {
        const id = req.params.id;
        db.remove(id)
            .then(user => {
                if (user) {
                    res.status(200).json({ message: `user ${id} was deleted.` })
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
            .catch((error) => {
                res.status(500).json({ errorMessage: `The user could not be removed.` })
            })
    })

    server.put('/api/users/:id', (req, res) => {
        const id = req.params.id
        const editUser = req.body
        if (!Object.keys(editUser).includes("name") || !Object.keys(editUser).includes("bio")){
            return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        }
        db.update(id, editUser)
          .then(users => {
            if (id) {
            res.status(200).json(users);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
          })
          .catch(err => {
            console.log('error', err);
            res.status(500).json({ error: 'The user information could not be modified.' });
          });
      });


const port = 4000;
server.listen(port, () => console.log(`\n ** API running on port ${port} ** \n`)
);