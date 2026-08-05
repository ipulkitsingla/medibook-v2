import mongoose from 'mongoose';

const diagnosisReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Assuming a Patient model exists, else fallback to User
    required: false
  },
  disease: {
    type: String,
    enum: ['Heart Disease', 'Diabetes', 'Parkinson\'s', 'Liver Disease'],
    required: true
  },
  prediction: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskCategory: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    required: true
  },
  recommendedDepartment: {
    type: String,
    required: true
  },
  recommendations: {
    type: [String],
    default: []
  },
  topFactors: {
    type: [mongoose.Schema.Types.Mixed], // Array of objects containing feature and impact
    default: []
  },
  shapValues: {
    type: mongoose.Schema.Types.Mixed, // Storing complex SHAP data structure
    default: {}
  },
  modelVersion: {
    type: String,
    required: true
  },
  doctorVerified: {
    type: Boolean,
    default: false
  },
  doctorNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const DiagnosisReport = mongoose.models.DiagnosisReport || mongoose.model('DiagnosisReport', diagnosisReportSchema);

export default DiagnosisReport;
