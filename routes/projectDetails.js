const express=require('express');
const router=express.Router();
const authMiddleware=require('../middlewares/authMiddleware')
const Project=require('../models/Project')

// DELETE /user/projects/:projectId/notices/:index
router.delete('/projects/:projectId/notices/:index', authMiddleware, async (req, res) => {
  const { projectId, index } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Only allow admin
    if (!project.adminId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Only admin can delete notices' });
    }

    if (index < 0 || index >= project.notices.length) {
      return res.status(400).json({ error: 'Invalid notice index' });
    }

    // Remove notice at index
    project.notices.splice(index, 1);
    await project.save();

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id)
      .populate('members', 'name')  // assuming members are user references
      .populate('notices')
      .populate('tasks');

    if (!project) return res.status(404).json({ error: 'Project not found' });

    const isAdmin = project.adminId.equals(req.user._id);
    console.log( {projectName: project.projectName,
      description: project.description,
      members: project.members,
      notices: project.notices,
      tasks: project.tasks,
      isAdmin,
      username:req.user.name})
    res.json({
      projectName: project.projectName,
      description: project.description,
      members: project.members.map((m) => m.name),
      notices: project.notices,
      tasks: project.tasks,
      isAdmin,
      username:req.user.name
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/projects/:id/description', authMiddleware, async (req, res) => {
  const { description } = req.body
  const { id } = req.params
  const project = await Project.findById(id)

  if (!project || !project.adminId.equals(req.user._id))
    return res.status(403).json({ error: 'Unauthorized' })

  project.description = description
  await project.save()

  res.json({ message: 'Description updated', project })
})


router.post('/projects/:id/notices', authMiddleware, async (req, res) => {
  const { notice } = req.body
  const { id } = req.params
  const project = await Project.findById(id)

  if (!project || !project.adminId.equals(req.user._id))
    return res.status(403).json({ error: 'Unauthorized' })

  project.notices.push(notice)
  await project.save()

  res.json({ message: 'Notice added', project })
})

router.post('/projects/:id/tasks', authMiddleware, async (req, res) => {
  const { task } = req.body;  // just task string
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Only admin can add task
    if (!project.adminId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    project.tasks.push(task);  // push string task directly
    await project.save();

    res.json({ message: 'Task assigned', task });  // respond with added task string
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/projects/:id/tasks/:index', authMiddleware, async (req, res) => {
  const { id, index } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!project.adminId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const taskIndex = parseInt(index, 10);
    if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= project.tasks.length) {
      return res.status(400).json({ error: 'Invalid task index' });
    }

    project.tasks.splice(taskIndex, 1);  // remove task at index
    await project.save();

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports=router;