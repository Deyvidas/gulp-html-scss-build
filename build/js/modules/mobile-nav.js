function MobileNav() {
    const navButton = document.querySelector('#mobileNavBtn');
    const navElement = document.querySelector('#mobileNav');
    const menuIcon = document.querySelector('#navIcon');
    navButton.onclick = () => {
        navElement.classList.toggle('mobile-nav--open');
        menuIcon.classList.toggle('nav-icon--active');
        document.body.classList.toggle('no-scroll');
    };
}
export { MobileNav };
