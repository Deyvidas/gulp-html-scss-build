function MobileNav() {
    const navButton = document.querySelector('#mobileNavBtn') as HTMLButtonElement;
    const navElement = document.querySelector('#mobileNav') as HTMLDivElement;
    const menuIcon = document.querySelector('#navIcon') as HTMLDivElement;

    navButton.onclick = () => {
        navElement.classList.toggle('mobile-nav--open');
        menuIcon.classList.toggle('nav-icon--active');
        document.body.classList.toggle('no-scroll');
    };
}

export { MobileNav };
