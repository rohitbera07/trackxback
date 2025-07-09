const express=require('express');
const router=express.Router();
const authMiddleware=require('../middlewares/authMiddleware')
const Project=require('../models/Project')
const JoinRequest=require('../models/Join')
router.post('/projects/:id/requests/:reqId', authMiddleware, async (req, res) => {
  const { id, reqId } = req.params;
  console.log(req.params)
  const { decision } = req.body; // 'accepted' or 'rejected'

  const project = await Project.findById(id);
  if (!project || !project.adminId.equals(req.user._id))
    return res.status(403).json({ error: 'Unauthorized' });

  const request = await JoinRequest.findById(reqId);
  if (!request || !request.projectId.equals(project._id))
    return res.status(404).json({ error: 'Request not found' });

  request.status = decision;
  request.respondedAt = new Date();
  await request.save();

  if (decision === 'accepted') {
    project.members.push(request.userId);
    await project.save();
  }

  res.json({ message: `Request ${decision}`, request });
});
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const adminId = req.user._id
    
    // 1. Find projects where logged-in user is admin
    const projects = await Project.find({ adminId })
   
    const projectIds = projects.map(p => p._id)
   
    if (projectIds.length === 0) {
      return res.json({ requests: [12] })
    }

    // 2. Find pending join requests for these projects
    const joinRequests = await JoinRequest.find({
      projectId: { $in: projectIds },
      status: 'pending'
    })
      .populate('userId', 'name')  // Get requester username
      .populate('projectId', 'projectName') // Get project name

    // 3. Format the response
    const requestsList = joinRequests.map(req => ({
      userId: req.userId._id,
      username: req.userId.name,
      projectId: req.projectId._id,
      projectName: req.projectId.projectName,
      requestId: req._id // useful for accept/reject endpoints
    }))

    res.json({ requests: requestsList })
  } catch (error) {
    console.error('Error fetching join requests:', error)
    res.status(500).json({ message: 'Server error' })
  }
})
module.exports=  router;
