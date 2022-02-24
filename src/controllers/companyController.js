const { Company } = require('../db/models');

class CompanyController {
  async getAll(req, res) {
    try {
      const companies = await Company.findAll({
        attributes: ['id', 'companyName',],
      });

      return res.json(companies);
    } catch (e) {
      return res.status(500).json({ message: 'Can not get companies' });
    }
  }
}

module.exports = new CompanyController();