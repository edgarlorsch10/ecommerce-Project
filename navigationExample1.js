//The content below will render in our routing area
const about=`<h1>I am an about page</h1>`;

const contact=`<h1>I am a contact page</h1>`;

const home=`<h1>I am a home page.</h1>`;

//We are going to decide our routes and page specific to that particular route and put them in an object
const routes={
    '/':home,
    '/contact':contact,
    '/about':about
};

//Now, we need to render a page when the index is initially loaded
//We will first select the root div and use .innerHTML to add content to the element according to the path
const rootDiv=document.getElementById('root');
rootDiv.innerHTML=routes[window.location.pathname];
const onNavigate=(pathname)=>{
    window.history.pushState({},pathname,window.location.origin + pathname);
    rootDiv.innerHTML=routes[pathname];
}
window.onpopstate=()=>{
    rootDiv.innerHTML=routes[window.location.pathname];
}