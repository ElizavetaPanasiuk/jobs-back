const sequelize = require('../db');
const { Company, Recruiter, User } = require('../db/models');

class RecruiterController {
  async getCompanyRecruiters(req, res) {
    const userId = req.user.id;
    
    const company = await Company.findOne({
      attributes: ['id'],
      where: { userId }
    });

    const companyId = company.id;

    try {
      const recruiters = await Recruiter.findAll({
        attributes: ['id', 'firstName', 'lastName', 'phone', [sequelize.col('user.email'), 'email']],
        include: [
          {
            model: User,
            attributes: [],
            required: false,
          },
        ],
        where: { companyId }
      });

      return res.json(recruiters);
    } catch (e) {
      return res.status(500).json({ message: 'Cannot get recruiters' });
    }
  }
}

module.exports = new RecruiterController();