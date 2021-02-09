import { itemsCartService } from '../services/itemsCart.js'; // to get the details/count about the cart
import { userService } from '../services/user.js'; // to check the user is loged in 

var user = userService.getUser();;  // gets a "user" or a "guest"

window.onDropdown = onDropdown;   // Vegetables or Fruits

$(window).on('load', async () => {
    if (user) {
        await itemsCartService.loadItemsCount()
    }
    renderNavBar()
});

function renderNavBar() {  // load the nav-bar
    renderTopNavbar();
    if (user) {
        renderProfileNav();
        $('.top-nav .btn-logout').click(onLogout); // triggers the log out function
    }
    $('.search-form').submit((ev) => { onSearch(ev) });

}

function renderTopNavbar() { // render top-nav
    var htmlStr = ``;
    if (user) {
        htmlStr = getNavTopLoginHtmlStr(); // if the user is loged in 
    } else {
        htmlStr = getNavTopLogoutHtmlStr(); // is the use has not loged in yet
    }
    $('.top-nav').html(htmlStr);
}


function renderProfileNav() { // Adding and render a href to the profile page + icon
    var htmlStr = `
        <li>
            <a href="/profile"><img src="/images/navBarIcons/user.png" />My profile</a>
        </li>`;
    $('.profileNav').html(htmlStr);
}

function getNavTopLoginHtmlStr() { // render a User nav-bar for the web functions
    return `
        ${getUsernameHtmlStr()}
        <ul class="clean-list">
            <li>
                <a href="/purchases">My purchases</a>
            </li>
            <li>
                <a href="/cart">
                    My cart
                    <img src="/images/navBarIcons/shoppingCart.svg" />
                    <span class="items-count">${itemsCartService.getItemsCount()}</span>  
                </a>
            </li>
            <li>
                <button class="btn-logout">Logout</button>
            </li>
        </ul>`;
}

function getNavTopLogoutHtmlStr() { // render a Guest nav-bar for signup/login
    return `
        ${getUsernameHtmlStr()}
        <ul class="clean-list">
            <li>
                <a href="/signup">Sign-up</a>
            </li>
            <li>
                <a href="/login">Login</a>
            </li>
        </ul>`;
}


function getUsernameHtmlStr() {  // Hello User if loged in or Guest if not
    var htmlStr = ''
    if (user) {
        htmlStr = `<a href="/profile">Hello, ${user.firstName} ${user.lastName}</a>`; // Get the profile page of the User
    } else {
        htmlStr = '<a href="/login">Hello, Guest</a>';
    }
    return htmlStr;
}



export function renderItemCount(count = itemsCartService.getItemsCount()) { // Render the number of items in the cart
    $('.items-count').text(count); 
}


function onDropdown() { // Vegtables or Fruits options - dropdown menu
    $('.dropdown').toggleClass('show-drop')
}

function onLogout(ev) { // Log out the user and returns to home page

    try {
        userService.logout();
        window.location.href = '/'; 
    } catch (err) {
        console.error(err);
        if (err.status === 401) {
            userService.logout();
            window.location.href = '/';
        }
    }
}

function onSearch(ev) { // Search option
    ev.preventDefault();

    var query = $('.search-input').val();
    var urlStr = `/store?q=${query}`;
    window.location.href = urlStr;
}
