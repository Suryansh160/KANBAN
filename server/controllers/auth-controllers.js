import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import User from '../models/User.js'
import logger from '../logger.js'

export async function signup (req, res) {
  try {
    const { name, email, password } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const hashedPassword = await argon2.hash(password)
    const user = await User.create({ name, email, password: hashedPassword })

    logger.info(`${user.name} signed up`, { userId: user._id })
    res.status(201).json({ message: 'Signup successful' })
  } catch (err) {
    logger.error('Signup failed', { error: err.message })
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function login (req, res) {
  try {
    const { email, password } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValid = await argon2.verify(user.password, password)
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    })

    logger.info(`${user.name} logged in`, { userId: user._id })

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    logger.error('Login failed', { error: err.message })
    res.status(500).json({ message: 'Something went wrong' })
  }
}
