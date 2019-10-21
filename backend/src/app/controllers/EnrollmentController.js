import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação!' });
    }

    const { student_id, plan_id, date } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não encontrado!' });
    }

    const { duration, price } = await Plan.findByPk(plan_id);

    const startDateFormat = parseISO(date);
    const dateWithDurationAdded = addMonths(startDateFormat, duration);
    const priceTotal = price * duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: startDateFormat,
      end_date: dateWithDurationAdded,
      total_price: priceTotal,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      weight: Yup.number()
        .required()
        .positive(),
      height: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação!' });
    }

    const student = await Student.findOne({ where: { email: req.body.email } });

    const { id, name, email, age, weight, height } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new EnrollmentController();
