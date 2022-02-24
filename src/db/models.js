const { DataTypes } = require('sequelize');

const sequelize = require('./index');

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleType: {
    type: DataTypes.STRING(56),
    unique: true,
    allowNull: false,
  }
});

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(56),
    allowNull: false,
    unique: true,
  }
});

const Company = sequelize.define('company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  logoUrl: {
    type: DataTypes.STRING(1000),
  }
});

const Recruiter = sequelize.define('recruiter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(56),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(56),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  companyId: {
    type: DataTypes.INTEGER,
  },
  avatarUrl: {
    type: DataTypes.STRING(1000),
  }
});

const Industry = sequelize.define('industry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  industryName: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  }
});

const Candidate = sequelize.define('candidate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(56),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(56),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING(56)),
  },
  softSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING(56)),
  },
  avatarUrl: {
    type: DataTypes.STRING(1000),
  }
});

const Job = sequelize.define('job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobName: {
    type: DataTypes.STRING(56),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
  },
  requiredExperience: {
    type: DataTypes.INTEGER,
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(38, 2),
  },
  employmentType: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['Full-Time', 'Part-Time', 'One-Time']],
    },
  },
  responsibilities: {
    type: DataTypes.ARRAY(DataTypes.STRING(255)),
  }
}, {
  timestamps: true,
  updatedAt: false,
});

const Application = sequelize.define('application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['approved', 'pending', 'rejected']],
    },
  },
  candidateLetter: {
    type: DataTypes.STRING(1000),
  },
  recruiterLetter: {
    type: DataTypes.STRING(1000),
  }
}, {
  timestamps: true,
  updatedAt: true,
});


Role.hasMany(User, { foreignKey: 'roleId' }); 
User.belongsTo(Role, { foreignKey: 'roleId' });

User.hasOne(Company, { foreignKey: 'userId' });
Company.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Recruiter, { foreignKey: 'userId' });
Recruiter.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Candidate, {  foreignKey: 'userId' });
Candidate.belongsTo(User, { foreignKey: 'userId'});

Industry.hasMany(Job, { foreignKey: 'industryId' });
Job.belongsTo(Industry, { foreignKey: 'industryId' });

Candidate.hasMany(Application, { foreignKey: 'candidateId' });
Application.belongsTo(Candidate, { foreignKey: 'candidateId' });

Recruiter.hasMany(Job, { foreignKey: 'recruiterId' });
Job.belongsTo(Recruiter, { foreignKey: 'recruiterId' });

Company.hasMany(Recruiter, { foreignKey: 'companyId' });
Recruiter.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Job, { foreignKey: 'companyId' });
Job.belongsTo(Company, { foreignKey: 'companyId' });

Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = {
  Role,
  User,
  Company,
  Recruiter,
  Industry,
  Candidate,
  Job,
  Application,
};