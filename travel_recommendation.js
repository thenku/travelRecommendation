
let data = {};
let searchRes = []
function handleSearch(){
    searchRes = [];
    const input = document.querySelector('#searchInput');
    let v = input.value;
    if(v == ""){
        updateHTML();
        return;
    }
    v = v.toLowerCase()
    const {countries, temples, beaches} = data;
    let words = v.split(' ').filter(e=>e);
    let countryIndex = words.findIndex((s)=>s.includes('country')||s.includes('countries'));
    const templeIndex = words.indexOf('temple');
    const beachIndex = words.findIndex((s)=>s.includes('beach'));
    const cityIndex = words.indexOf('city');
    if(countryIndex > -1){
        words.splice(countryIndex,1);
        addMatches(countries, words);
    }else if(templeIndex > -1){
        words.splice(templeIndex,1);
        addMatches(temples, words);
    }
    else if(beachIndex > -1){
        words.splice(beachIndex,1);
        addMatches(beaches, words);
    }
    else if(cityIndex > -1){
        words.splice(cityIndex,1);
        for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
            if(country.cities){
                addMatches(country.cities, words);
            }
       }
    }else{
        addMatches(countries, words);
        addMatches(temples, words);
        addMatches(beaches, words);
           for (let i = 0; i < countries.length; i++) {
                const country = countries[i];
                if(country.cities){
                    addMatches(country.cities, words);
                }
           }
    }
    updateHTML();
}
function updateHTML(){
    const recc = document.querySelector("#recommendations");
    if(recc){
        recc.innerHTML = "";
        let myHTML = '';
        for (let i = 0; i < searchRes.length; i++) {
            const {name, description, imageUrl} = searchRes[i];
            myHTML += `<div><div><img src="${imageUrl}"/></div>
            <div><h2>${name}</h2>`;
            if(description){
                myHTML+= `<p>${description}</p>`
            }
            myHTML += '</div></div>'
        }
        recc.innerHTML = myHTML;
    }
}
function addMatches(arr = [{name:"", description:""}], words = []){
    for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
        const {name, description} = row;
        const n = name.toLowerCase();
        const d = (description) ? description.toLowerCase() : "";

        let matches = false;
        if(words.length == 0){
            matches = true;
        }else{
            for (let j = 0; j < words.length; j++) {
                const word = words[j];
                //match every word
                if(n.indexOf(word) > -1 || d.indexOf(word) > -1){
                    matches = true;
                }else{
                    matches = false;
                    break;
                }
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
                if(e.key == "Enter"){
                    setTimeout(()=>{
                        handleSearch();
                    }, 200)
                }
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