import Role from '../role/role.model.js';
import User from '../user/user.model.js';

export const isValidRol = async (role = '') => {
    const existsRole = await Role.findOne({ role });

    if (!existsRole) {
        throw new Error(`The role ${role} does not exists in the database`);
    }
}

export const existsEmail = async (email = '') => {
    const existsE = await User.findOne({ email });

    if (existsE) {
        throw new Error(`The email ${email} was registred`);
    }
}

export const existsUserById = async (id = '') => {
    const existsUser = await User.findById(id);

    if (!existsUser) {
        throw new Error(`ID: ${id} does not exists`);
    }
}

export const isOwner = async (id = '', user = {}) => {
    if (id !== user._id.toString()) {
        throw new Error(`You do not have permissions to update this user`);
    }
}

export const confirmation = async (response) => {
    
    if (response.toLowerCase() == 'no') {
        throw new Error(`User not deleted`);
    }
}

export const isValidStock = async(stock) => {
    if(stock <= 0){
        throw new Error('Stock is not valid');
    }
}
