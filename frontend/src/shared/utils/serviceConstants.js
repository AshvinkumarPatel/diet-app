const serviceConstants = {
    login: {
        method: 'POST',
        url: '/api/users',
        endpoint: '/login',
    },
    signUp: {
        method: 'POST',
        url: '/api/users',
        endpoint: '/signup',
    },
    getUsers: {
        method: 'GET',
        url: '/api/users',
        endpoint: '',
    },
    getUserDetails: {
        method: 'POST',
        url: '/api/users',
        endpoint: '/getUserDetails',
    },
    updateDailyThreshold: {
        method: 'PATCH',
        url: '/api/users',
        endpoint: '/updateDailyThresHold',
    },
    createFood: {
        method: 'POST',
        url: '/api/foods',
        endpoint: '',
    },
    updateFood: {
        method: 'PATCH',
        url: '/api/foods',
        endpoint: '',
    },
    deleteFood: {
        method: 'DELETE',
        url: '/api/foods',
        endpoint: '',
    },
    getFoodsListByUserId: {
        method: 'GET',
        url: '/api/foods',
        endpoint: '/user',
    },
    getAllFoodsList: {
        method: 'GET',
        url: '/api/foods',
        endpoint: '/all',
    },
};

export default serviceConstants;
