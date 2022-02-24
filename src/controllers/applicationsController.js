const ROLES = require('../constants/roles');
const sequelize = require('../db');
const { Application, Candidate, Job, Company, Industry, Recruiter, User } = require('../db/models');

class ApplicationController {
  async apply (req, res) {
    try {
      const userId = req.user.id;
      const { candidateLetter, jobId } = req.body;

      const candidate = await Candidate.findOne({
        where: {
          userId,
        }
      });

      const candidateId = candidate.id;

      const application = await Application.findOne({
        where: {
          candidateId,
          jobId
        }
      });
      if (application) {
        return res.status(500).json({message: 'This candidate already has an application on this job'})
      }

      const newApplication = await Application.create({
        status: 'pending',
        candidateLetter,
        candidateId,
        jobId
      });

      return res.json(newApplication);
    } catch (e) {
      return res.status(500).json({message: 'Can not create application'});
    }
  }

  async approve (req, res) {
    try {
      const { id } = req.body;
      
      await Application.update({
        status: 'approved'
      }, { where: {id}});
  
      return res.json({ message: 'Application approved successfully' });
    } catch (e) {
      return res.status(500).json({message: 'Can not approve application'});
    }
  }

  async reject (req, res) {
    try {
      const { id } = req.body;

      await Application.update({
        status: 'rejected'
      }, { where: {id}});

      return res.json({ message: 'Application rejected successfully' });
    } catch (e) {
      return res.status(500).json({message: 'Can not reject application'});
    }
  }

  async getAll (req, res) {
    try {
      const page =  req.query.page || 1;
      const size = req.query.size || 10;
      const offset = size * (page - 1);
      const userId = req.user.id;
      const userRole = req.user.roleId;

      const candidate = await Candidate.findOne({
        where: {
          userId,
        }
      });
  
      const candidateId = candidate?.id;
      
      const recruiter = await Recruiter.findOne({
        where: {
          userId,
        }
      });

      const recruiterId = recruiter?.id;

      const company = await Company.findOne({
        where: {
          userId,
        }
      });

      const companyId = company?.id;

      let applications;

      if (userRole === ROLES.candidate) {
        applications = await Application.findAndCountAll({
          attributes: [
            'id',
            'status',
            'jobId',
            'updatedAt',
            'candidateId',
            [sequelize.col('job.jobName'), 'jobName'],
            [sequelize.col('job.recruiterId'), 'recruiterId'],
            [sequelize.col('job.companyId'), 'companyId'],
            [sequelize.col('job->company.companyName'), 'companyName'],
            [sequelize.col('job->company.logoUrl'), 'logoUrl'],
            [sequelize.col('job->industry.industryName'), 'industryName']
          ],
          include: [
            {
              model: Job,
              attributes: [],
              required: true,
              where: recruiterId ? {
                recruiterId
              } : companyId ? { 
                companyId
              } : null,
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
                }
              ]
            },
          ],
          where: candidateId ? {
            candidateId
          }: null,
          order: [
            ['updatedAt', 'DESC']
          ],
          limit: size,
          offset: offset,
        });
      } else {
        applications = await Application.findAndCountAll({
          attributes: [
            'id',
            'status',
            'jobId',
            'updatedAt',
            'candidateId',
            [sequelize.col('job.jobName'), 'jobName'],
            [sequelize.col('job.recruiterId'), 'recruiterId'],
            [sequelize.col('candidate.firstName'), 'candidateFirstName'],
            [sequelize.col('candidate.lastName'), 'candidateLastName'],
          ],
          include: [
            {
              model: Job,
              attributes: [],
              required: true,
              where: recruiterId ? {
                recruiterId
              } : companyId ? { 
                companyId
              } : null,
            },
            {
              model: Candidate,
              attributes: [],
              required: true,
            }
          ],
          where: candidateId ? {
            candidateId
          }: null,
          order: [
            ['updatedAt', 'DESC']
          ],
          limit: size,
          offset: offset,
        });
      }

      return res.json({ isLast: applications.count === size * (page - 1) + applications.rows.length, data: applications.rows, count: applications.count});
    } catch (e) {
      return res.status(500).json({message: 'Can not get applications'});
    }
  }

  async getApplicationLetters (req, res) {
    const id = req.params.id;
  
    try {
      const applicationLetters = await Application.findOne({
        attributes: [
          'id',
          'candidateLetter',
          'recruiterLetter'
        ],
        where: { id }
      });

      return res.json(applicationLetters)
    } catch (e) {
      return res.status(500).json({ message: 'Can not get application letters' });
    }
  }

  async getApplicationCandidateData (req, res) {
    const id = req.params.id;

    try {
      const candidateData = await Application.findOne({
        attributes: [
          ['candidateLetter', 'letter'],
          'status',
          [sequelize.col('candidate.firstName'), 'firstName'],
          [sequelize.col('candidate.lastName'), 'lastName'],
          [sequelize.col('candidate.phone'), 'phone'],
          [sequelize.col('candidate.skills'), 'skills'],
          [sequelize.col('candidate.softSkills'), 'softSkills'],
          [sequelize.col('candidate->user.email'), 'email'],
        ],
        include: [
          {
            model: Candidate,
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

      return res.json(candidateData);
    } catch (e) {
      return res.status(500).json({ message: 'Can not get candidate info' });
    }
  }
}

module.exports = new ApplicationController();