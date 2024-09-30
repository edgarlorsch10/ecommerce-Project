const main=document.querySelector('main');
const linkClickHandler=(e)=>{
    e.preventDefault();
    let path=e.target.getAttribute('href')||"/";
    if(!path.startsWith("/"))path="/"+path;
    history.pushState({},null,path);
    route();
}
document.querySelector("nav a").addEventListener("click",linkClickHandler);
window.addEventListener("popstate",()=>{
    route();
})
const route=()=>{
    let path=location.pathname;
    let pathName=path.replace(/\/+$/,path==='/'? '/':' ');
    switch(pathName){
        case '/': case '/index.html':Home();break;
        case '/tools':Tools();break;
        case '/tools/words-counter:':WordCounter();break;
        default:notFound();break;
    }
}

var home;
const Home=()=>{
    if(!home){
        let homeUI="<header>\
        <figure>\
            <picture>\
                <img src='revenant7.jpg'></img>\
            </picture>\
        </figure>\
        <h1>Welcome to text tools SPA</h1>\
        <p>Illustration of creating an spa</p>\
        <div>\
        <a class='linkBtn' target='_blank'>SPA theory</a>\
         <a class='linkBtn' target='_blank'>SPA Code</a>\
        </div>\
          </header>\
          <p>A lot of words.</p>\
          <a class='linkBtn' style='display:block;margin:10px auto;width:fit-content;'>Explore Text Tools</a>";
          home=document.createElement("div");
          home.classList.add("home");
          home.innerHTML=homeUI;
          home.lastElementChild.addEventListener("click",linkClickHandler);
    }
    main.replaceChildren(home);
}
route();