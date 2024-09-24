const getJWTToken = () => {
    return localStorage.getItem('jwt_token');
}

export {getJWTToken}