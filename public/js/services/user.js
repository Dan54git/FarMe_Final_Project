const url = location.hostname === 'localhost'
    ? '//localhost:3000/api/user'
    : '/api/user';
const key = 'user'; // Storage key

export const userService = {
    singUp,
    login,
    logout,
    saveUser,
    getUser,
    updateUser,
};

async function singUp(signupFrom) {
    try {
        var res = await axios.post(`${url}/signup`, signupFrom); // connects us with the server. api/routes/users.js and triggers the /signup
        var user = res.data
        saveUser(user);
        return user;
    } catch (err) {
        throw err;
    }
}

async function login(loginFrom) {
    try {
        var res = await axios.post(`${url}/login`, loginFrom); // api/routes/users.js and triggers the /login
        var user = res.data
        saveUser(user);
        return user;
    } catch (err) {
        throw err;
    };
}

function logout() {
    try {
        axios.get(`${url}/logout`); // api/routes/user.js /logout

        sessionStorage.clear();
    } catch (err) {
        console.log(err.response);
        throw err;
    }
}

// Saves the user in the session storege
function saveUser(user) {
    sessionStorage.setItem(key, JSON.stringify(user));
}


function getUser(user) {  // gets the user from the sessionStorege if false then return undefined
    var user = sessionStorage.getItem(key)
    return JSON.parse(user);
}

async function updateUser(user) {
    try {
        var res = await axios.patch(`${url}/${user._id}`, user); // api/routes/user.js /updateUser
        console.log(res);
        var userUpdated = res.data;
        console.log({ userUpdated });
        saveUser(userUpdated);
        return userUpdated;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
