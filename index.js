const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'Iwan Course1'},
    {id: 2, name: 'Iwan Course2'},
    {id: 3, name: 'Iwan Course3'},
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.query)
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});

// POST
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    // Add course
    courses.push(course);
    res.status(200).send(course);
});

// PUT
app.put('/api/courses/:id', (req, res) => {
    // check course, not existing return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    
    // validation
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update course
    course.name = req.body.name;
    res.status(200).send(course);
});

// DELETE
app.delete('/api/courses/:id', (req, res) => {
    // check course, not existing return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    
    // Delete course
    courses.splice(index, 1);
    res.status(200).send(course);

});

function validateCourse(course) {
    //joi version 17.4.0
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);    
}

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening onport ${port}...`));