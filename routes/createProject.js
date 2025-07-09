const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/projects', authMiddleware, async (req, res) => {
  console.log("POST /user/projects hit")
  const { projectName } = req.body;
  const projectId = generateUniqueCode(); // 6-8 char alphanumeric
    function generateUniqueCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}
 console.log('User:', req.user);

  const project = await Project.create({
    projectName,
    adminId: req.user._id,
    projectId
  });

  project.members.push(req.user._id); // Add creator as a member
  await project.save();

  res.status(201).json(project);
});

// GET /api/projects/my
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id

    const projects = await Project.find({
      $or: [
        { adminId: userId },
        { members: userId }
      ]
    }).populate('adminId', 'name') // to get admin name

    const formatted = projects.map(p => ({
      _id: p._id,
      projectName: p.projectName,
      projectId:p.projectId,
      adminName: p.adminId.name,
      isAdmin: p.adminId._id.toString() === userId
    }))

    res.json({ projects: formatted })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports=router;