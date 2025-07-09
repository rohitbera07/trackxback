const express=require('express');
const router=express.Router();
const authMiddleware=require('../middlewares/authMiddleware')
const Project=require('../models/Project')
const JoinRequest=require('../models/Join')

router.post('/projects/join', authMiddleware, async (req, res) => {
  const { projectId } = req.body;

  const project = await Project.findOne({ projectId });
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const exists = await JoinRequest.findOne({
    userId: req.user._id,
    projectId: project._id
  });
  if (exists) return res.status(400).json({ error: 'Request already sent' });

  const request = await JoinRequest.create({
    userId: req.user._id,
    projectId: project._id,
    status: 'pending'
  });

  res.status(200).json({ message: 'Request sent', request });
});
module.exports =router;