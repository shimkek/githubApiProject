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
        const watchers_count_text = object.items[i].watchers_count;
        const description = object.items[i].description;
        const language = object.items[i].language;
        const updated_at = object.items[i].updated_at;
        const html_url = object.items[i].html_url;

        const full_name_El = document.createElement('a');
        full_name_El.textContent = full_name;
        full_name_El.className = `repoList__name`;
        full_name_El.href = html_url;
        
        const description_El = document.createElement('p');
        description_El.textContent = description;

        const watchers_El = document.createElement('a');
        const star = document.createElement('span');
        star.style.fontSize='20px';
        star.textContent = `☆`;
        const watchers_number = document.createElement('span');
        watchers_number.style.fontSize='14px';
        watchers_number.textContent = `${watchers_count_text}`;
        watchers_El.appendChild(star);
        watchers_El.appendChild(watchers_number);
        watchers_El.className = `repoList__watchersCount`;
        watchers_El.href = `${html_url}/stargazers`;

        const language_El = document.createElement('span');
        language_El.style.fontSize='12px';
        language_El.className=`repoList__language`;
        language_El.textContent= `  ${language}  `;

        const updated_at_El = document.createElement('span');
        updated_at_El.style.fontSize='12px';
        updated_at_El.textContent = `Updated on ${updated_at.slice(0, 10)}`;

        

        li.appendChild(full_name_El);
        li.appendChild(description_El);
        li.appendChild(watchers_El);
        li.appendChild(language_El);

        if (object.items[i].license !== null) {
            const license_El = document.createElement('span');
            license_El.style.fontSize='12px';
            license_El.textContent = `${object.items[i].license.name}`;
            license_El.className = `repoList__license`;
            li.appendChild(license_El);
        };
        
        li.appendChild(updated_at_El);
        li.className = "repoList__item";
        ul.appendChild(li);
    }
}

createRepoList();

document.getElementById('button').addEventListener('click', searchRepository);