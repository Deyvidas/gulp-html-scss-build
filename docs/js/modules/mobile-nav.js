function MobileNav(){const o=document.querySelector("#mobileNavBtn"),e=document.querySelector("#mobileNav"),c=document.querySelector("#navIcon");o.onclick=(()=>{e.classList.toggle("mobile-nav--open"),c.classList.toggle("nav-icon--active"),document.body.classList.toggle("no-scroll")})}export{MobileNav};