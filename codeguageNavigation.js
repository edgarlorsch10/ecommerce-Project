let button=document.querySelector("button");
let messages=document.querySelector("#messages");
/*button.addEventListener("click",(e)=>{
    history.pushState(null," ","current-entry");
});*/
//In the example above,I've used the button to add a new entry to the history stack, info about the newly added entry is null, title is an empty string,and the url of the new entry is "current-entry"


/*button.addEventListener("click",(e)=>{
    history.replaceState(null," ","replacing-entry");
});*/
//Upon clicking the button, I replace the current entry in the session's history stack with this new entry whose info is null, title is an empty string and url is "replacing-entry"

button.addEventListener("click",(e)=>{
history.pushState({pageData:"my data"}," ","testPage.html");
});
(function firstView(){
  history.replaceState("HI","","");
})()

window.addEventListener("popstate",(e)=>{
  messages.innerHTML=`<div>${JSON.stringify(e.state)}</div>`;
  console.log(e.state);
});
//(()=>history.replaceState("Olivier Sarah",""))();
//history.replaceState({y:2},"","");
//Note, the state parameter normally carries the information about the entry we are either adding or replacing, ie using pushState() or replaceState()
//When popstate fires an entry for which a state was given to the method producing that entry,the event's argument object has its state property set to that value
//Once we press the button, there are two occasions of importance:
//1)When we go back from the pushed entry to the initial entry
//2)When we go forward from the initial entry to the pushed entry
//This is what happens in each case

/*When we go back to our initial entry , after pushState() has been executed and the url changed,popstate gets fired and the state property of the 
event object becomes null. Its the default value for every single document.*/

//From this point on, if we go forward to the pushed entry,popstate would get fired again, but this time the state property of the event object would be equivalent to that passed as the state parameter
//Of which in my case it would be {pageData:"my data"},this is because, the state parameter was configured to be {pageData:'my data'}, at the time of executing the pushState() method                                         


//Note: whenever navigation to an entry x is made,the state property of the event's object would be the same object set for that entry x
//This means that, if for example you call pushState(), and set its state parameter to {x:1}, and go back to the previous entry, the dispatched popsate event's state property won't hold the object {x:1}
//This is because, when you go back, the entry to which you're taken is not the same as the one that was set using pushState()
//However, from this point, if you go forward to this pushed entry,popstate would fire and its state property would be set to {x:1}, since the state was set for this specific entry