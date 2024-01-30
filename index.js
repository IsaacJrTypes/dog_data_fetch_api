import express from 'express';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

async function getDogAPIResponse(param = "",page="") {
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
        const htmlFile = fs.readFileSync('./HTMLTemplate/breeds.html','utf8')
        const tailwindListCSS = "inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg"
        const dogListhtml = apiResponse.data.map((dog) => `<li class="${tailwindListCSS}"><a href= "/breeds/${dog.id}">${dog.attributes.name}</a></li>`).join("")
        const updatedHTML = htmlFile.replace('{{%dogList%}}',dogListhtml)
        
        res.type('text/html');
        res.send(updatedHTML);

    } catch (err) {
        console.log(err)
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
        let htmlFile = fs.readFileSync('./HTMLTemplate/breed-info.html', 'utf8')
        //console.log(dogAttributes)
        // Replace sections of html
        htmlFile = htmlFile.replace('{{%breedName%}}',dogAttributes.name)
        htmlFile = htmlFile.replace('{{%description%}}', dogAttributes.description);
        htmlFile = htmlFile.replace('{{%life.min%}}', dogAttributes.life.min)
        htmlFile = htmlFile.replace('{{%life.max%}}', dogAttributes.life.max)
        htmlFile = htmlFile.replace('{{%hypoallergenic%}}', dogAttributes.hypoallergenic? "Yes :)": "No :(")

        res.type('text/html')
        res.send(htmlFile);
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

Part 2 modified to fit part 4 requirements

*/


/*
Part 5: Working with Dog Facts and Groups

Goals:
Fetch and display a list of random dog facts.
Fetch and display information about different dog groups.

Tasks:
[x] Use the /facts endpoint to fetch dog facts.
[x] Display these facts in an interesting format on the webpage.
[x] Use the /groups endpoint to fetch information about dog groups and display it.
*/
app.get('/facts', async (req, res) => {
    try {
        const apiResponse = await getDogAPIResponse('facts');
        const factObj = apiResponse.data[0];
        console.log(factObj)
        let htmlFile = fs.readFileSync('./HTMLTemplate/facts.html', 'utf8')
        htmlFile = htmlFile.replace("{{%dogFact%}}",factObj.attributes.body)
        

        res.type('text/html');
        res.send(htmlFile);
        //console.log(factObj);
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send("Server Error");
    }
});

app.get('/groups', async(req,res) => {
    try {
        const apiResponse = await getDogAPIResponse('groups')
        let htmlFile = fs.readFileSync('./HTMLTemplate/groups.html', 'utf8')
        const tailwindListCSS = "inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg"
        console.log(apiResponse.data)
       
        const dogGroupList = apiResponse.data.map((group) => `<li class='${tailwindListCSS}'>` + group.attributes.name + '</li>').join('')
        htmlFile = htmlFile.replace('{{%dogList%}}',dogGroupList)
        res.type('text/html')
        res.send(htmlFile);


    } catch(err) {
        console.log("Error: ", err);
        res.status(500).send("Server Error");
    }
})

app.use((req, res) => {
    const htmlFile = fs.readFileSync('./HTMLTemplate/notFound.html', 'utf8')
    res.type("text/html");
    res.status(404);
    res.send(htmlFile);
}); 

app.listen(app.get('port'), () => {
    console.log(`Express running at ${port}`);
    console.log(`In browser go to: http://localhost:${port}`);
});

