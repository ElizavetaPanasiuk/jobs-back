const { Op } = require('sequelize');

const sequelize = require('../db');
const { Job } = require('../db/models');

class StatisticsController {
  async getStatistics (req, res) {
    try {
      const period = req.query.period;
      let startDate;

      if (period === 'day') {
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      } else if (period === 'week') {
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === 'month') {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      } else if (period === 'year') {
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      } else {
        return res.status(500).json({message: 'Invalid period value'});
      }
      
      const jobsCount = await Job.count({
        where: {
          createdAt: {
            [Op.gte]: startDate.toISOString()
          }
        }
      });

      const jobsByIndustry = await sequelize.query(
        `SELECT industries.id, industries."industryName", COUNT(jobs."industryId") AS "jobsCount"
          FROM industries, jobs 
          WHERE industries.id = jobs."industryId"
          AND jobs."createdAt" >= ?
          GROUP BY industries.id`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: [startDate.toISOString()]
        }
      );
      
      const top5CompaniesByNewJobs = await sequelize.query(
        `SELECT companies.id, companies."companyName", COUNT(jobs."companyId") AS "jobsCount"
          FROM companies, jobs 
          WHERE companies.id = jobs."companyId"
          AND jobs."createdAt" >= ?
          GROUP BY companies.id
          ORDER BY "jobsCount" DESC
          LIMIT 5`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: [startDate.toISOString()]
        }
      );

      res.json({jobsCount, jobsByIndustry, top5CompaniesByNewJobs});
    } catch (e) {
      return res.status(500).json({message: `Can not get statistics for the last ${period}`});
    }
  }
}

module.exports = new StatisticsController();