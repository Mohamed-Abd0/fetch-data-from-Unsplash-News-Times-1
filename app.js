/*************  define the global variables ***************/ 

// Get the form 
const form = document.querySelector('#search-form');
// Get the search field
const searchField = document.querySelector('#search-keyword');
// define avariable to put the search words in
let searchedForText;
// Get the response container
const responseContainer = document.querySelector('#response-container');




/*************  Handle the submition from user ***************/ 

// add listener to the form when submition
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // put the search value into a variable 
    searchedForText = searchField.value;

    // make a new request 
    let unsplashReq = new XMLHttpRequest();
    // define the method and url of the request 
    unsplashReq.open('Get', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    // add the Authorization    
    unsplashReq.setRequestHeader('Authorization', 'Client-ID 3iblNns8LGiwGcN2fqROuhumC_vsVUR5_jlXpjrIRBc');
    // send the request to unsplash api
    unsplashReq.send();
    // Handle the sucsess request 
    unsplashReq.onload = sucsessHandler;
    // Handle the failed request 
    unsplashReq.onerror = errorHandler;
    
    // this funcition to Handle the sucsess request 
    function sucsessHandler(){
        const  data = JSON.parse(this.responseText);
        const firstImg = data.results[0];
        
        if (data && data.results && data.results[0]){
            let htmlContent = `
            <figure>
            <img src="${firstImg.urls.small}" alt="${searchedForText}" width="1000px">
            <figcaption>taken by ${firstImg.user.name}</figcaption>
            </figure>
            `
            // show the result on the screen 
            responseContainer.insertAdjacentHTML('beforeend' , htmlContent);
        }else{
            // if no image fond print this message 
            responseContainer.insertAdjacentHTML('beforeend' , `<div class="error-no-image">No image available</div>`);
        }
    }
    
    // this fuction to Handle the failed request
    function errorHandler(err){
        console.log('error :' , err);
    }
    
    
    
    // make another request to news times 
    const articleRequest = new XMLHttpRequest();
    articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=9BqBn1TC1HEuFUEAqno5mf8GclmlHWgv`);
    articleRequest.send();
    articleRequest.onload = addArticles;
    articleRequest.onerror = errorHandler;
    
    // this function will be trigger when the request sucsess
    function addArticles () {
        let data = JSON.parse(this.responseText);
        console.log(data)

        if (data.response && data.response.docs && data.response.docs.length>=1 ){
            let articles = data.response.docs.map((article)=>`
            <li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
            </li>
            `).join('')
            let htmlContent= '<ul>' + articles + '</ul>'
            responseContainer.insertAdjacentHTML('beforeend' , htmlContent)
        }else{
            responseContainer.insertAdjacentHTML('beforeend' , `<div class="error-no-articles">No article available</div>`)
        }
    }
});
