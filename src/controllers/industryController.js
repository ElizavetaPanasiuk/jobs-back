const { Industry } = require('../db/models');

class IndustryController {
  async getAll(req, res) {
    try {
      const industries = await Industry.findAll({
        attributes: ['id', 'industryName'],
      });
      
      return res.json(industries);
    } catch (e) {
      return res.status(500).json({ message: 'Can not get industries' });
    }
  }
}

module.exports = new IndustryController();