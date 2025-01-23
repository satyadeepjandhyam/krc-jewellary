const sharp = require('sharp');

function Normalnamevalidation(name) {
    if (!name) {
        return 'Name is required';
    }
    if (typeof name !== 'string') {
        return 'Name must be a string';
    }
    if (name.length > 20) {
        return 'Name must be less than 20 characters';
    }
    if (name.length < 3) {
        return 'Name must be at least 3 characters';
    }
    if (name[0] === ' ' || name[0] === '.') {
        return 'Name cannot start with space';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name must contain only alphabets and spaces';
    }
    
    return null;
}

function cityNormalnamevalidation(name) {
    if (!name) {
        return 'City Name is required';
    }
    if (typeof name !== 'string') {
        return 'Name must be a string';
    }
    if (name.length > 20) {
        return 'Name must be less than 20 characters';
    }
    if (name.length < 3) {
        return 'Name must be at least 3 characters';
    }
    if (name[0] === ' ' || name[0] === '.') {
        return 'Name cannot start with space';
    }
    
    return null;
}


function validateEmail(email) {
    if (!email) {
        return 'Email is required';
    }
    if (typeof email !== 'string') {
        return 'Email must be a string';
    }
    if (email.length > 75) {
        return 'Email must be less than 75 characters';
    }
    if (email.length < 4) {
        return 'Email must be at least 4 characters';
    }
    if (email[0] === '.' || email[0] === '@') {
        return 'Email cannot start with . or @';
    }
    if (email.includes('..')) {
        return 'Email cannot contain consecutive .';
    }
    if(email.includes(' ')){
        return 'Leading spaces should not be allowed';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Email must be a valid email format';
    }
    if (/[A-Z]/.test(email)) {
        return 'Email must be lowercase';
    }
    if(email.includes('_')){
        return 'Email cannot symbols';
    }
    const domainPart = email.split('@')[1];
    if (domainPart.split('.').length > 2) {
        return 'Email domain must not contain multiple consecutive TLDs (like .com.com)';
    }
    return null;
}

function validatePassword(password) {
    if (!password) {
        return 'Password is required';
    }
    if (password.includes(' ')) {
        return 'Leading spaces should not be allowed';
    }    
    if (typeof password !== 'string') {
        return 'Password must be a string';
    }
    
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    if(password.length > 13){
        return 'Password must be less than 13 characters';
    }
    if(password.length < 8){
        return 'Password must be at least 8 characters';
    }
    return null;
}

function validatePhone(phone) {
    if(phone.length === 13 && phone[0] === '+' && phone[1] === '9' && phone[2] === '1'){
        let phone1 = phone.slice(3);
        if (phone1.includes(' ')) {
            return 'Leading spaces should not be allowed';
        }
        if (typeof phone1 !== 'string') {
            return 'Phone must be a string';
        }
        if (!/^\d{10}$/.test(phone1)) {
            return 'Phone number must be 10 digits';
        }
        if (phone1[0] != '9' && phone1[0] != '8' && phone1[0] != '7' && phone1[0] != '6') {
            return 'Phone number must start with 9, 8, 7, or 6';
        }
        return null;
    }
    if(phone.length > 10){
        return 'Phone number must be 10 digits';
    }
    if (!phone) {
        return 'Phone is required';
    }
    if (phone.includes(' ')) {
        return 'Leading spaces should not be allowed';
    }
    if (typeof phone !== 'string') {
        return 'Phone must be a string';
    }
    if (!/^\d{10}$/.test(phone)) {
        return 'Phone number must be 10 digits';
    }
    if (phone[0] != '9' && phone[0] != '8' && phone[0] != '7' && phone[0] != '6') {
        return 'Phone number must start with 9, 8, 7, or 6';
    }
    return null;
}

function validatelocuation(location) {
    if (typeof location !== 'string') {
        return 'Location must be a string';
    }
    if(location.includes(' ')){
        return 'Leading spaces should not be allowed';
    }
    if (location.length > 30) {
        return 'Location must be less than 30 characters';
    }
    if (location.length < 3) {
        return 'Location must be at least 3 characters';
    }
    if (!/^[a-zA-Z]+$/.test(location)) {
        return 'Invalid location';
    }
    return null;
}

function validateName(name){
    if (!name) {
        return 'ALL is required';
    }
    if (typeof name !== 'string') {
        return 'Name must be a string';
    }
    if (name.length > 30) {
        return 'Name must be less than 30 characters';
    }
    if (name.length < 3) {
        return 'Name must be at least 3 characters';
    }
    // include space also
    if (!/^[a-zA-Z ]+$/.test(name)) {
        return 'only contain alphabets';
    }
    return null;
}

function validatePassword1(password) {

    if (password.includes(' ')) {
        return 'Leading spaces should not be allowed';
    }    
    if (typeof password !== 'string') {
        return 'Password must be a string';
    }
    
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    if(password.length > 13){
        return 'Password must be less than 13 characters';
    }
    if(password.length < 8){
        return 'Password must be at least 8 characters';
    }
    return null;
}


function validateImage(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

    // Check if file is provided
    if (!file) {
        return 'Image file is required';
    }

    // Check if the file type is allowed
    if (!allowedTypes.includes(file.mimetype)) {
        return 'Invalid file type. Only JPEG, PNG, and GIF are allowed';
    }

    // Check if the file size exceeds the limit
    if (file.size > maxSizeInBytes) {
        return 'File size exceeds 2 MB';
    }

    // Use sharp to check image dimensions
    return sharp(file.data).metadata()
        .then(metadata => {
            const width = metadata.width;
            const height = metadata.height;

            // Check for minimum dimensions
            if (width < 100 || height < 100) {
                return 'Image dimensions must be at least 100x100 pixels';
            }

            return null; // Image is valid
        })
        .catch(err => {
            return 'Invalid image file';
        });
}

function Normalnamevalidationxxxxx(name, field) {
    if (!name) {
        return `${field} is required`;
    }
    if (typeof name !== 'string') {
        return `${field} must be a string`;
    }
    if (name.length > 30) {
        return `${field} must be less than 30 characters`;
    }
    if (name.length < 3) {
        return `${field} must be at least 3 characters`;
    }
    if (name[0] === ' ' || name[0] === '.') {
        return `${field} cannot start with space`;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return `${field} must contain only alphabets and spaces`;
    }
    
    return null;
}


async function adminValidateImage(file, imageHeight, imageWidth, field) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

    // Check if file is provided
    if (!file) {
        return `${field} is required`;
    }

    // Check if the file type is allowed
    if (!allowedTypes.includes(file.mimetype)) {
        return `Invalid file type. Only JPEG, PNG, and GIF are allowed`;
    }

    // Check if the file size exceeds the limit
    if (file.size > maxSizeInBytes) {
        return `File size exceeds 5 MB`;
    }

    try {
        // Use sharp to get image dimensions
        const metadata = await sharp(file.data).metadata();
        const width = metadata.width;
        const height = metadata.height;

        // Check if the image dimensions match the provided dimensions
        if (width !== imageWidth || height !== imageHeight) {
            return `${field} dimensions must be exactly ${imageWidth} X ${imageHeight} pixels`;
        }

        return null; // Image is valid
    } catch (err) {
        return `Invalid ${field} file`;
    }
}


module.exports = {
    validateEmail,
    validatePassword,
    validatePhone,
    validatelocuation,
    validateName,
    validateImage,
    validatePassword1,
    Normalnamevalidation,
    Normalnamevalidationxxxxx,
    adminValidateImage  ,
    cityNormalnamevalidation
};
