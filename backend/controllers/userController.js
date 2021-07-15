import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  const token = await jwt.sign({email ,id:user._id },'abc123')
        res.status(200).json({user , token})

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: (user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})


// @desc    Auth user profile & get token
// @route   GET  /api/users/login
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {

const user = await User.findById(req.user._id)

if (user){
res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
})
}
else {
res.status(404)
throw new Error ('user not found')
}
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })
    
 


  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })
  const token = await jwt.sign({email ,id:user._id },'abc123')
  res.status(200).json({user , token})
  
  
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: user.id,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})


// @desc    update user profile 
// @route   put  /api/users/login
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id)
  
  if (user){
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if(req.body.password) {
      user.password = req.body.password
    }
    const updateUser = await user.save()
   
    res.json({
      _id:  updateUser._id,
      name:  updateUser.name,
      email:  updateUser.email,
      isAdmin:  updateUser.isAdmin,
      token: ( updateUser._id),
    })
  } else {
    res.status(404)
throw new Error ('user not found')
  }
  })

  export {authUser , getUserProfile , registerUser , updateUserProfile
  }