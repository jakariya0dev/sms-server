import router from 'express';
import StudentController from './student.controller';

const studentRouter = router();
const studentController = new StudentController();

studentRouter.get('/', studentController.getAllStudents);
studentRouter.get('/:id', studentController.getStudent);
studentRouter.post('/', studentController.createStudent);
studentRouter.put('/:id', studentController.updateStudent);
studentRouter.delete('/:id', studentController.deleteStudent);

export default studentRouter;