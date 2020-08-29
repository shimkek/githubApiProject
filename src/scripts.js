import 'regenerator-runtime/runtime';
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const testURL = 'https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc';

console.log('basic initialization');

const searchRepository = async() => {
    console.log('searchRepository function started');

    const textArea = document.getElementById('input');
    console.log('fetching...');
    const searchResult = await getFetchResult(testURL);
    console.log(searchResult);
    fillRepoList(searchResult);
    
}

const getFetchResult = async(url) => {
    let response = await fetch(url);

    console.log(response.headers.get('x-ratelimit-remaining')+`/10 requests left`);
    
    let result = await response.json();
    console.log('fetching done');
    return result;
}

const createRepoList = () => {
    let ul = document.createElement('ul');
    ul.className = 'repoList';
    ul.id = 'repoList';
    document.body.appendChild(ul);
}

const fillRepoList = (object) => {
    const ul = document.getElementById('repoList');

    for (let i=0; i<object.items.length; i++) {
        const li = document.createElement('li');
        const full_name = object.items[i].full_name;
        const watchers_count = object.items[i].watchers_count;
        const description = object.items[i].description;
        const language = object.items[i].language;
        const updated_at = object.items[i].updated_at;
        const html_url = object.items[i].html_url;

        const full_name_El = document.createElement('a');
        full_name_El.textContent = full_name;
        full_name_El.href = html_url;

        li.appendChild(full_name_El);
        li.className = "repoList__item";
        ul.appendChild(li);
    }
}

createRepoList();

document.getElementById('button').addEventListener('click', searchRepository);