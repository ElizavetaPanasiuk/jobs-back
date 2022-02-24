const { Op } = require('sequelize');

const sequelize = require('../db');
const { User, Job, Company, Industry, Recruiter, Application } = require('../db/models');

class JobController {
  async getAll (req, res) {
    try {
      const jobName = req.query.search?.toLowerCase() || '';
      const industry = req.query.industry || '';
      const employmentType = req.query.employmentType || '';
      const minimumHourlyRate = req.query.minimumHourlyRate || 0;
      const minimumRequiredExperience = req.query.minimumExperience || 0
      const page =  req.query.page || 1;
      const size = req.query.size || 10;
      const offset = size * (page - 1);
  
      const jobs = await Job.findAndCountAll({
        attributes: [
          'id',
          'jobName',
          'hourlyRate',
          'createdAt',
          [sequelize.col('company.companyName'), 'companyName'],
          [sequelize.col('company.logoUrl'), 'logoUrl'],
          [sequelize.col('industry.industryName'), 'industryName']
        ],
        include: [
          {
            model: Company,
            attributes: [],
            required: false,
          },
          {
            model: Industry,
            attributes: [],
            where: {
              industryName: industry 
                ? {
                  [Op.any]: industry.split(',')
                  } 
                : {
                    [Op.substring]: ''
                  },
            },
          },
        ],
        where: {
          jobName: {
            [Op.iLike]: `%${jobName}%`
          },
          employmentType: employmentType 
            ? {
              [Op.any]: employmentType.split(',')
              } 
            : {
                [Op.substring]: ''
              },
          hourlyRate: minimumHourlyRate !== 0
            ? {
              [Op.gte]: minimumHourlyRate
            } 
            : {
              [Op.or]: [
                {
                  [Op.is]: null
                },
                {
                  [Op.gte]: 0,
                }
              ]
            },
          requiredExperience: minimumRequiredExperience !== 0
            ? {
              [Op.gte]: minimumRequiredExperience
            } 
            : {
              [Op.or]: [
                {
                  [Op.is]: null
                },
                {
                  [Op.gte]: 0,
                }
              ]
            },
        },
        order: [
          ['createdAt', 'DESC']
        ],
        limit: size,
        offset: offset,
      });
  
      return res.json({ isLast: jobs.count === size * (page - 1) + jobs.rows.length, data: jobs.rows, count: jobs.count });
    } catch (e) {
      return res.status(500).json({message: 'Can not get jobs'});
    }
  }

  async getJobById(req, res) {
    try {
      const id = req.params.id;

      const job = await Job.findOne({
        attributes: [
          'id',
          'jobName',
          'description',
          'requiredExperience',
          'employmentType',
          'hourlyRate',
          'createdAt',
          'responsibilities',
          [sequelize.col('company.companyName'), 'companyName'],
          [sequelize.col('industry.industryName'), 'industryName'],
          [sequelize.col('applications.id'), 'applicationId'],
        ],
        include: [
          {
            model: Company,
            attributes: [],
            required: false,
          },
          {
            model: Industry,
            attributes: [],
            required: false,
          },
          {
            model: Application,
            attributes: [],
            required: false,
          }
        ],
        where: { id }
      });
  
      return res.json(job);
    } catch (e) {
      return res.status(500).json({message: 'Can not get job by Id'});
    }
  }

  async create(req, res) {
    try {
      const userId = req.user.id;
      const { jobName, description, requiredExperience, hourlyRate, employmentType, responsibilities, industryId} = req.body;
  
      if (!jobName.length) {
        return res.status(500).json({ message: 'Invalid job name' });
      }
      
      const recruiter = await Recruiter.findOne({
        where: {
          userId,
        },
      });
      const recruiterId = recruiter.id;
      const companyId = recruiter.companyId;
  
      const newJob = await Job.create({
        jobName,
        description,
        requiredExperience,
        hourlyRate, 
        employmentType,
        responsibilities,
        industryId,
        recruiterId, 
        companyId
      });
  
      return res.json(newJob);
    } catch (e) {
      return res.status(500).json({message: 'Job creation error'});
    }
  }

  async getRecruiterJobList (req, res) {
    try {
      const userId = req.user.id;
      const jobName = req.query.search?.toLowerCase() || '';
      const page =  req.query.page || 1;
      const size = req.query.size || 10;
      const offset = size * (page - 1);
  
      const recruiter = await Recruiter.findOne({
        where: {
          userId,
        },
      });
  
      if (!recruiter) {
        return res.status(500).json({ message: 'Recruiter with such id doesn\'t exist' });
      }
  
      const recruiterId = recruiter.id;
  
      const jobs = await Job.findAndCountAll({
        attributes: [
          'id',
          'jobName',
          'hourlyRate',
          'createdAt',
          [sequelize.col('company.companyName'), 'companyName'],
          [sequelize.col('company.logoUrl'), 'logoUrl'],
          [sequelize.col('industry.industryName'), 'industryName']
        ],
        include: [
          {
            model: Company,
            attributes: [],
            required: false,
          },
          {
            model: Industry,
            attributes: [],
            required: false,
          },
        ],
        where: {
          recruiterId,
          jobName: {
            [Op.iLike]: `%${jobName}%`
          },
        },
        order: [
          ['createdAt', 'DESC']
        ],
        limit: size,
        offset: offset,
      });
  
      return res.json({ isLast: jobs.count === size * (page - 1) + jobs.rows.length, data: jobs.rows, count: jobs.count});
    } catch (e) {
      return res.status(500).json({message: 'Can not get recruiter\'s jobs list'});
    }
  }

  async getCompanyJobList (req, res) {
    try {
      const userId = req.user.id;
      const jobName = req.query.search?.toLowerCase() || '';
      const page =  req.query.page || 1;
      const size = req.query.size || 10;
      const offset = size * (page - 1);
  
      const company = await Company.findOne({
        where: {
          userId,
        },
      });
  
      if (!company) {
        return res.status(500).json({ message: 'Company with such id doesn\'t exist' });
      }
  
      const companyId = company.id;
  
      const jobs = await Job.findAndCountAll({
        attributes: [
          'id',
          'jobName',
          'hourlyRate',
          'createdAt',
          [sequelize.col('company.companyName'), 'companyName'],
          [sequelize.col('company.logoUrl'), 'logoUrl'],
          [sequelize.col('industry.industryName'), 'industryName']
        ],
        include: [
          {
            model: Company,
            attributes: [],
            required: false,
          },
          {
            model: Industry,
            attributes: [],
            required: false,
          },
        ],
        where: {
          companyId,
          jobName: {
            [Op.iLike]: `%${jobName}%`
          },
        },
        order: [
          ['createdAt', 'DESC']
        ],
        limit: size,
        offset: offset,
      });
  
      return res.json({ isLast: jobs.count === size * (page - 1) + jobs.rows.length, data: jobs.rows, count: jobs.count });
    } catch (e) {
      return res.status(500).json({message: 'Can not get company\'s jobs list'});
    }
  }

  async getJobRecruiterData (req, res) {
    const id = req.params.id;

    try {
      const recruiterData = await Job.findOne({
        attributes: [
          [sequelize.col('recruiter.firstName'), 'firstName'],
          [sequelize.col('recruiter.lastName'), 'lastName'],
          [sequelize.col('recruiter.phone'), 'phone'],
          [sequelize.col('recruiter->user.email'), 'email'],
        ],
        include: [
          {
            model: Recruiter,
            attributes: [],
            required: true,
            include: [
              {
                model: User,
                attributes: [],
                required: true,
              }
            ]
          }
        ],
        where: {
          id
        }
      });

      return res.json(recruiterData);
    } catch (e) {
      return res.status(500).json({ message: 'Can not get recruiter info' });
    }
  }
}

module.exports = new JobController();