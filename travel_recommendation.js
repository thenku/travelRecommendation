
let data = {};
let searchRes = []
function handleSearch(){
    searchRes = [];
    const input = document.querySelector('#searchInput');
    const v = input.value;
    if(v == ""){
        updateHTML();
        return;
    }
    const {countries, temples} = data;
    addMatches(countries, v);
    addMatches(temples, v);
       for (let i = 0; i < countries.length; i++) {
            const country = countries[i];
            if(country.cities){
                addMatches(country.cities, v);
            }
       }
    console.log(v, searchRes)
    updateHTML();
}
function updateHTML(){
    const recc = document.querySelector("#recommendations");
    if(recc){
        recc.innerHTML = "";
        let myHTML = '';
        for (let i = 0; i < searchRes.length; i++) {
            const {name, description, imageUrl} = searchRes[i];
            myHTML += `<div><div><img src="https://picsum.photos/seed/${name}s/200/300"/></div>
            <div><h2>${name}</h2>`;
            if(description){
                myHTML+= `<p>${description}</p>`
            }
            myHTML += '</div></div>'
        }
        recc.innerHTML = myHTML;
    }
}
function addMatches(arr = [{name:"", description:""}], s = ""){
    s = s.toLowerCase();
    for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
        const {name, description} = row;
        const n = name.toLowerCase();
        const d = (description) ? description.toLowerCase() : "";

        const splitWords = s.split(' ').filter(e=>e);
        let matches = false;
        for (let j = 0; j < splitWords.length; j++) {
            const word = splitWords[j];
            //match every word
            if(n.indexOf(word) > -1 || d.indexOf(word) > -1){
                matches = true;
            }else{
                matches = false;
                break;
            }
        }
        if(matches){
            searchRes.push(row);
        }
        
    }

}
function clearInput(){
    const input = document.querySelector('#searchInput');
    input.value = "";
    searchRes = [];
    updateHTML();
}

document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {

        const input = document.querySelector('#searchInput');
        if(input){
            input.onkeypress = (e)=>{
                setTimeout(()=>{
                    handleSearch();
                }, 200)
            }
            input.onclick = (e)=>{
                setTimeout(()=>{
                    handleSearch();
                }, 200)
            }
        }
        const btn = document.querySelector('#searchButton');
        if(btn){
            btn.onclick = (e)=>{
                handleSearch();
            }
        }
        const resetBtn = document.querySelector('#resetButton');
        if(resetBtn){
            resetBtn.onclick = (e)=>{
                clearInput();
            };
        }
        fetch('./travel_recommendation_api.json').then(res=>res.json()).then(json => {
            data = json;
            // console.log(json)
        });
    }
  });