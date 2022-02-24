const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, Recruiter, Candidate, Company } = require('../db/models');
const ROLES = require('../constants/roles');

function generateToken(id, email, roleId) {
  const token = jwt.sign(
    {
      id,
      email,
      roleId
    }, 
    process.env.SECRET_KEY, 
    {
      expiresIn: '24h'
    }
  );

  return token;
}

class AuthController {
  #SALT_ROUNDS = 7;
  
  check = async (req, res, next) => {
    const token = generateToken(req.user.id, req.user.email, req.user.roleId);
    return res.json({ token });
  }

  createByRoleType = async (roleId, userId, req) => {
    if (roleId === ROLES.candidate) {
      const { firstName, lastName, phone} = req.body;
      await Candidate.create({firstName, lastName, phone, userId });
    }

    if (roleId === ROLES.company) {
      const { companyName, companyDescription, phone, logoUrl } = req.body;
      await Company.create({companyName, description: companyDescription, phone, userId, logoUrl});
    }

    if (roleId === ROLES.recruiter) {
      const { firstName, lastName, phone, companyId } = req.body;
      await Recruiter.create({firstName, lastName, phone, companyId, userId});
    }
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email,
        }
      });
        
      if (!user) {
        return res.status(500).json({ message: `User with email ${email} doesn't exist`});
      }
  
      const isPasswordRight = await bcrypt.compare(password, user.dataValues.password);
  
      if (!isPasswordRight) {
        return res.status(500).json({ message: 'Incorrect password' });
      }
  
      const token = generateToken(user.dataValues.id, user.dataValues.email, user.dataValues.roleId);
  
      return res.json({ token });
    } catch (e) {
      return res.status(500).json({message: 'Login error'});
    }

  }

  registration = async (req, res) => {
    try {
      const {email, password, roleId} = req.body;
  
      if (!email || !password) {
        return res.status(404).json({ message: 'Incorrect email or password' });
      }
  
      const user = await User.findOne({ where: { email } });
      
      if (user) {
        return res.status(404).json({ message: 'The user with such email already exists' });
      }
  
      const hashedPassword = bcrypt.hashSync(password, this.#SALT_ROUNDS);
      const newUser = await User.create({email, password: hashedPassword, roleId});
  
      await this.createByRoleType(roleId, newUser.dataValues.id, req);
  
      const token = generateToken(newUser.dataValues.id, newUser.dataValues.email, newUser.dataValues.roleId);
  
      return res.json({ token });
    } catch (e) {
      return res.status(500).json({message: 'Registration error'});
    }
  }
}

module.exports = new AuthController();