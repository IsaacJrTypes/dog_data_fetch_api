import express from 'express';
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

async function getDogAPIResponse(id = "") {
    try {
        let response;
        if (id == '') {
            response = await fetch('https://dogapi.dog/api/v2/breeds');
        } else {
            response = await fetch('https://dogapi.dog/api/v2/breeds/' + id);
        }
        console.log("Fetch status: " + response.status);
        return response.json();
    } catch (err) {
        console.err('Fetch Err:', err);
    }
}

app.set('port', port);

/* 
Part 2: Handling Responses

Goal: Handle the API responses and errors.

Task:
[x] Check if the fetch request was successful and throw an error if not.
[x] Handle the JSON response by displaying breed names in an HTML list.
[x] Add error handling for network errors or if the API is down.
*/
app.get('/breeds', async (req, res) => {
    try {
        const apiResponse = await getDogAPIResponse();
        res.type('text/html');
        res.send(apiResponse.data.map((dog) => `<li>${dog.attributes.name}</li>`).join(""));

    } catch (err) {
        res.status(500).send("Server Error");
    }
});

/*
Part 3: Displaying Detailed Breed Information

Goal: Fetch and display detailed information about a specific dog breed.

Task:
[x] Create a function to fetch details of a specific breed using its ID (endpoint /breeds/{id}).
[x] Display the breed's name, description, and other attributes in a structured format.
*/

app.get('/breeds/:id', async (req, res) => {
    // Grap param
    const param = req.params;
    //console.log(param)
    try {
        const apiResponse = await getDogAPIResponse(param.id);
       // console.log(apiResponse.data);
        const dogAttributes = apiResponse.data.attributes;
        const html = `
        <div>
        <p>Breed: ${dogAttributes.name}</p>
        <p>Description: ${dogAttributes.description}</p>
        <p>Life Span: ${dogAttributes.life.min} - ${dogAttributes.life.max} Years </p>
        <p>hypoallergenic: ${dogAttributes.hypoallergenic ? "Yes :)" : "No :("}</p>
        </div>
        `;
        res.type('text/html').send(html);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

app.use((req, res) => {
    res.type("text/plain");
    res.status(404);
    res.send("404: Page not found");
});

app.listen(app.get('port'), () => {
    console.log(`Express running at ${port}`);
    console.log(`In browser go to: http://localhost:${port}`);
});

