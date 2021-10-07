/*************  define the global variables ***************/ 

// Get the form 
const form = document.querySelector('#search-form');
// Get the search field
const searchField = document.querySelector('#search-keyword');
// define avariable to put the search words in
let searchText;
// Get the response container
const responseContainer = document.querySelector('#response-container');



/*************  Handle the submition from user ***************/ 

// add listener to the form when submition
form.addEventListener('submit', function (e) {
    e.preventDefault();
    // reset the content 
    responseContainer.innerHTML= '';
    
    // this funcition to Handle the sucsess of unsplash request 
    const sucsessHandler=(data)=>{
        const firstImg = data.results[0];
        
        if (firstImg){
            let htmlContent = `
            <figure>
                <img src="${firstImg.urls.small}" alt="${searchText}">
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
    
    // this funcition to Handle the sucsess of Time News request
    const addArticles= (data)=> {
        if (data.response.docs.length>1 ){
            const articles = data.response.docs.map((article)=>`
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
    
    // this fuction to Handle the failed request
    const errorHandler= (err)=>{
        console.log('error :' , err);
    }


    // put the search value into a variable 
    searchText = searchField.value;
    
    // put the initializations of the request in variable
    const intits = {
        method  : 'GET',
        headers : {'Authorization' : 'Client-ID b9ee_0RFMShrcjQHenznTYFYcCG9zsm_1-IJikJeKnQ'}
    }

    // fetch data from unsplash 
    fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchText}` , intits)
    .then(response => response.json())
    .then(sucsessHandler)
    .catch(errorHandler)

    // fech data from Time News
    fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchText}&api-key=48nqNs5BRQuCCJztzgbrMFWDykCLPpwi`)
    .then(response=> response.json())
    .then(addArticles)
    .catch(errorHandler)

});
