async function predict(){
const data={
glucose:document.getElementById('glucose').value,
bmi:document.getElementById('bmi').value,
age:document.getElementById('age').value,
insulin:document.getElementById('insulin').value
};

const res=await fetch('http://127.0.0.1:5000/predict',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify(data)
});

const result=await res.json();

document.getElementById('result').innerHTML=
`<h3>${result.prediction}</h3>
<p>Probability: ${result.probability!==null?(result.probability*100).toFixed(2)+'%':'N/A'}</p>`;
}
