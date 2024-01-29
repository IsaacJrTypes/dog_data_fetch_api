import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

async function getDogAPIResponse(param = "") {
    try {
        let response;
        if (param === '') {
            response = await fetch('https://dogapi.dog/api/v2/breeds');

        } else if (param === 'facts') {
            response = await fetch('https://dogapi.dog/api/v2/facts');

        } else if (param === 'groups') {
            response = await fetch('https://dogapi.dog/api/v2/groups')

        } else {
            response = await fetch('https://dogapi.dog/api/v2/breeds/' + param);
        }
        console.log("Fetch status: " + response.status);
        return response.json();
    } catch (err) {
        console.log('Fetch Err:', err);
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

/*
Part 4: Interactive Breed Selection

Goal: Create an interactive list of dog breeds that displays detailed information upon selection.

Task:
[x] Render the list of breeds as selectable elements in the HTML document.
[x] Add an event listener to each breed that fetches and displays detailed information when clicked.
*/
app.get('/breed-list', async (req, res) => {
    try {
        const apiResponse = await getDogAPIResponse();
        res.type('text/html');
        res.send(apiResponse.data.map((dog) => `<li><a href="/breeds/${dog.id}">${dog.attributes.name}</a></li>`).join(""));
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }


});

/*
Part 5: Working with Dog Facts and Groups

Goals:
Fetch and display a list of random dog facts.
Fetch and display information about different dog groups.

Tasks:
[x] Use the /facts endpoint to fetch dog facts.
[] Display these facts in an interesting format on the webpage.
[x] Use the /groups endpoint to fetch information about dog groups and display it.
*/
app.get('/facts', async (req, res) => {
    try {
        const apiResponse = await getDogAPIResponse('facts');
        const factObj = apiResponse.data[0];
        const html = `
        <div>
        <p>Fact</p>
        <p>${factObj.attributes.body}</p>
        </div>
        `;

        res.type('text/html');
        res.send(html);
        console.log(factObj);
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send("Server Error");
    }
});

app.get('/groups', async(req,res) => {
    try {
        const apiResponse = await getDogAPIResponse('groups')
        console.log(apiResponse.data)
        const html = `
        <div>
        <p>Dog Groups</p>
        <ul>${apiResponse.data.map((group) => '<li>'+group.attributes.name+'</li>').join('')}
        </ul>
        </div>
        `
        res.type('text/html')
        res.send(html);


    } catch(err) {
        console.log("Error: ", err);
        res.status(500).send("Server Error");
    }
})

app.use((req, res) => {
    res.type("text/plain");
    res.status(404);
    res.send("404: Page not found");
});

app.listen(app.get('port'), () => {
    console.log(`Express running at ${port}`);
    console.log(`In browser go to: http://localhost:${port}`);
});

