function getjoke(){
    fetch('https://official-joke-api.appspot.com/random_joke')
    .then(response=>response.json())
    .then(data=>{
        console.log(`${data.setup}-${data.punchline}`);
        document.getElementById('joke').innerHTML = `${data.setup}-${data.punchline}`;
    })
    .catch(error =>{
        console.error('Error:', error);
    });
}

