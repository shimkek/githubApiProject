const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();
const { createOAuthAppAuth } = require("@octokit/auth");
import 'regenerator-runtime/runtime';
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let pagesDisplayed = 0;
let lastSearchRequest = [];
//const testURL = 'https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc&per_page=10';
//const urlWithPage = [`${testURL}&page=1`, 1];

console.log('basic initialization');

const searchRepository = async(isSearchRequestNew) => {
    console.clear();
    console.log('searchRepository function started');
    pagesDisplayed++;
    

    if (isSearchRequestNew === true) {
        console.log(`Search request:${document.getElementById('input').value}`);
        document.getElementById('repoList').innerHTML='';
        pagesDisplayed = 1;
        
    }

    if(document.getElementById('input').value !== '' && isSearchRequestNew === true) { 
        console.log('fetching...');

        
        const searchResult = await getFetchResult(createSearchRequest());
        console.log(searchResult);
        fillRepoList(searchResult);
        document.getElementById('loadMoreButton').disabled = false;

    } else if (document.getElementById('input').value === '' && isSearchRequestNew === true){
        console.log(`No value provided`);
    } else {
        const lastSearchRequestAndPage = `${lastSearchRequest[0]}${lastSearchRequest[1]+1}`      
        console.log(lastSearchRequestAndPage);
        const searchResult = await getFetchResult(lastSearchRequestAndPage);
        console.log(searchResult);
        fillRepoList(searchResult);
        lastSearchRequest[1]++;
    }
};

const createSearchRequest = () => {
    const plainText = document.getElementById('input').value;
    console.log(`Plain Text:'${plainText}'`);
    let result = `https://api.github.com/search/repositories?q=${plainText.trim()}`;
    console.log(result);

    lastSearchRequest = [`${encodeURI(result)}&sort=stars&order=desc&per_page=10&page=`, 1];
    console.log(lastSearchRequest);
    result = `${encodeURI(result)}&sort=stars&order=desc&per_page=10&page=1`;
    console.log(result);

    document.getElementById('input').value = '';

    return result;
};

const getFetchResult = async(url) => {
    let response = await fetch(url);

    console.log(response.headers.get('x-ratelimit-remaining')+`/10 requests left`);
//    console.log(response.headers.get('link'));
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
    const total_results = object.total_count;
    
    console.log(`Total results:${total_results} Current page:${pagesDisplayed}`);
    
    if (document.getElementById(`noRepositoriesMessage`) !== null) {
        document.getElementById(`noRepositoriesMessage`).remove();
    }

    
    if (object.items.length === 0) {
        const loadMoreButton = document.getElementById('loadMoreButton');
        const noRepositoriesMessage = document.createElement('div');
        noRepositoriesMessage.id = `noRepositoriesMessage`;
        noRepositoriesMessage.className = `repoList__message`;
        noRepositoriesMessage.textContent = `No more repositories to display 	(｡◕‿‿◕｡)`;
        document.body.insertBefore(noRepositoriesMessage, loadMoreButton);
        loadMoreButton.disabled = true;
    };

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

        const updated_at_El = document.createElement('span');
        updated_at_El.style.fontSize='12px';
        updated_at_El.textContent = `Updated on ${updated_at.slice(0, 10)}`;

        

        li.appendChild(full_name_El);
        li.appendChild(description_El);
        li.appendChild(watchers_El);

        if (object.items[i].language !== null){
            const language_El = document.createElement('span');
            language_El.style.fontSize='12px';
            language_El.className=`repoList__language`;
            language_El.textContent= `  ${language}  `;
            li.appendChild(language_El);
        }

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

        
    };
    if (document.getElementById('loadMoreButton')=== null) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.className = 'repoList__button';
        loadMoreButton.id = 'loadMoreButton';
        loadMoreButton.textContent = 'load more';
        document.body.appendChild(loadMoreButton);
        document.getElementById('loadMoreButton').addEventListener('click', function() {
        searchRepository(false);
    });


    };
}

const parseCodeFromUrl = () => {
    const url = new URL(window.location.href);   
    const code = url.searchParams.get('code');

    return code;
}

const getAccessToken = async(code) => {
    const auth = createOAuthAppAuth({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        code: code, // code from OAuth web flow, see https://git.io/fhd1D
      });
      
    const appAuthentication = await auth({
        type: "oauth-app",
        url: "/orgs/:org/repos",
      });
    const tokenAuthentication = await auth({ type: "token" });

    console.log(tokenAuthentication);
};

const checkAuth = () => {
    console.log('Checking for authorization');
    const isAuthorized = localStorage.getItem('isAuthorized');
    if (isAuthorized === true) {
        console.log('Authorizaton successful');
    } else  {
        localStorage.setItem('isAuthorized', false);
        const code = parseCodeFromUrl();
        if (code !== null) {
            getAccessToken(code);
        } else {
            console.log('Authorizaton not complete');
        };
    };
}

createRepoList();
checkAuth();

document.getElementById('button').addEventListener('click', function() {
    searchRepository(true);
});

document.getElementById('login').addEventListener('click', async function() {
    const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
    location.href=url;
})