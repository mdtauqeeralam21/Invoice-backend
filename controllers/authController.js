import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError,UnAuthenticatedError } from '../errors/index.js';
import xssFilters from 'xss-filters';

const oneDay = 1000 * 60 * 60 * 24;

const register = async (req, res) => {
  const { name, email, password } = req.body;


  if (!name || !email || !password) {
    
    throw new BadRequestError("Please provide all values");
  }

  const userAlreadyExists = await User.findOne({email});

  if(userAlreadyExists){
    throw new BadRequestError(`The email: ${email} is already in use.`);
  }


  const user = await User.create({ name, email, password });

  const token = user.createToken();
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const isAdminUser = email === adminEmail && password === adminPassword;

  if (isAdminUser) {
    user.isAdmin = true;
    await user.save();
  }

  const token = user.createToken();
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });


  res.status(StatusCodes.OK).json({
    name: user.name,
    email: user.email
  });
};


// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if(!email || !password) {
//     throw new BadRequestError("Please provide all values");
//   }

  
  
//   const user = await User.findOne({ email }).select('+password');

//   if(!user) {
//     throw new UnAuthenticatedError("Invalid Credentials");
//   }

//   const isPasswordCorrect = await user.comparePassword(password);

//   if(!isPasswordCorrect) {
//     throw new UnAuthenticatedError("Invalid Credentials");
//   }

//   const token = user.createToken();
//   res.cookie('token', token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === 'production',
//   });

//   user.password = undefined;

//   res.status( StatusCodes.OK ).json({ 
//     user
//   });
// };

const updateUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = xssFilters.inHTMLData(email);
  user.name = xssFilters.inHTMLData(name);

  await user.save();

  const token = user.createToken();
  
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.OK).json({ 
    name: user.name,
    email: user.email
  });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ 
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(StatusCodes.OK).json({
    msg: 'User logged out!'
  });
};

export { register, login, updateUser, getCurrentUser, logout }