const ROLES = require('../constants/roles');
const { Candidate, Recruiter, Company } = require('../db/models');

class ProfileController {
  async get(req, res) {
    try {
      const userId = req.user.id;
      const roleId = req.user.roleId;

      if (roleId === ROLES.candidate) {
        const profileData = await Candidate.findOne({
          attributes: [
            'id',
            'firstName',
            'lastName',
            'phone',
            'skills',
            'softSkills'
          ],
          where: { userId }
        });

        return res.json(profileData);
      }

      if (roleId === ROLES.company) {
        const profileData = await Company.findOne({
          attributes: [
            'id',
            'companyName', 
            'description',
            'phone',
            'logoUrl'
          ],
          where: { userId }
        });

        return res.json(profileData);
      }

      if (roleId === ROLES.recruiter) {
        const profileData = await Recruiter.findOne({
          attributes: [
            'id',
            'firstName',
            'lastName',
            'phone'
          ],
          where: { userId }
        });

        return res.json(profileData);
      }

    } catch (e) {
      return res.status(500).json({message: 'Cannot get profile data'});
    }
  }

  async update(req, res) {
    try {
      const userId = req.user.id;
      const roleId = req.user.roleId;

      if (roleId === ROLES.candidate) {
        const { firstName, lastName, phone, skills, softSkills } = req.body;
        
        const updatedCandidate = await Candidate.update({
          firstName,
          lastName,
          phone,
          skills, 
          softSkills
        }, {
          where: {
            userId
          }
        });
    
        return res.json(updatedCandidate);
      }

      if (roleId === ROLES.company) {
        const { companyName, description, phone, logoUrl } = req.body;
        
        const updatedCompany = await Company.update({
          companyName,
          description,
          phone,
          logoUrl,
        }, {
          where: {
            userId
          }
        });
    
        return res.json(updatedCompany);
      }

      if (roleId === ROLES.recruiter) {
        const { firstName, lastName, phone } = req.body;
        
        const updatedRecruiter = await Recruiter.update({
          firstName,
          lastName,
          phone,
        }, {
          where: {
            userId
          }
        });
    
        return res.json(updatedRecruiter);
      }
    } catch (e) {
      return res.status(500).json({message: 'Candidate updated'});
    }
  }
}

module.exports = new ProfileController();