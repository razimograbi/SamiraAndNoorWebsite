import {BestMain} from './bestsimFolder/applyBestsim.js';
import {BlandMain} from './blandFolder/applyBland.js';
import { GreedyMain } from './greedyFolder/applyGreedy.js';

let currentlySelectedVersionOption = null;

const translateBtn = document.querySelector('.translate-btn');
const fileInput = document.getElementById('fileInput');

const versionOptions = document.querySelectorAll('.option');


fileInput.addEventListener('change', (e) => {
    if(!e.target.value){
        return;
    }
    document.querySelector('.file-path-wrapper span').innerHTML = e.target.value.split('\\').pop();
});


versionOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        if(currentlySelectedVersionOption){
            document.getElementById(currentlySelectedVersionOption).classList.remove('selected');
        }
        currentlySelectedVersionOption = e.target.id;
        e.target.classList.add('selected');
    });
});


translateBtn.addEventListener('click', (e) => {
    if(!currentlySelectedVersionOption || !fileInput.value){ // show error message
        document.querySelector('.error-message-wrapper').classList.remove('invisible');
        return;
    }
    document.querySelector('.error-message-wrapper').classList.add('invisible');
    
    if(currentlySelectedVersionOption === "option1"){ // selected the first option
        const applySimplexBestsim = new BestMain();
        applySimplexBestsim.enter(fileInput);
    }else if(currentlySelectedVersionOption === "option2"){
        const applySimplexBland = new BlandMain();
        applySimplexBland.enter(fileInput);
    }else{
        const applySimplexGreedy = new GreedyMain();
        applySimplexGreedy.enter(fileInput);
    }
});


